const Profile = require('../models/Profile');
const Project = require('../models/Project');
const User = require('../models/User');

/**
 * getMyProfile — Returns the authenticated user's profile.
 *
 * Route: GET /api/profile/me (protected)
 */
const getMyProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      // Auto-create a profile, seeding name & email from the User account
      profile = await Profile.create({
        userId: req.user._id,
        name: req.user.name || '',
        email: req.user.email || '',
      });
    }

    res.status(200).json({
      success: true,
      data: { profile },
      message: 'Profile retrieved',
    });
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to retrieve profile',
    });
  }
};

/**
 * updateProfile — Manually edit profile fields.
 *
 * Route: PUT /api/profile/update (protected)
 * Body: { bio?, location?, experience?, education?, skills?, links? }
 */
const updateProfile = async (req, res) => {
  try {
    const {
      name,
      avatar,
      bio,
      intro,
      headline,
      location,
      email,
      phone,
      website,
      experience,
      education,
      skills,
      links,
      achievements,
    } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (bio !== undefined) updateData.bio = bio;
    if (intro !== undefined) updateData.intro = intro;
    if (headline !== undefined) updateData.headline = headline;
    if (location !== undefined) updateData.location = location;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (website !== undefined) updateData.website = website;
    if (experience !== undefined) updateData.experience = experience;
    if (education !== undefined) updateData.education = education;
    if (skills !== undefined) updateData.skills = skills;
    if (links !== undefined) updateData.links = links;
    if (achievements !== undefined) updateData.achievements = achievements;

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updateData },
      { new: true, upsert: true }
    );

    // Keep User model synced with name, avatar, email
    const userUpdates = {};
    if (name) userUpdates.name = name;
    if (avatar) userUpdates.avatar = avatar;
    if (email) userUpdates.email = email;
    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(req.user._id, { $set: userUpdates });
    }

    res.status(200).json({
      success: true,
      data: { profile },
      message: 'Profile updated',
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to update profile',
    });
  }
};

/**
 * getProjects — Returns all synced projects for the authenticated user.
 *
 * Route: GET /api/profile/projects (protected)
 */
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({
      score: -1,
    });

    res.status(200).json({
      success: true,
      data: { projects },
      message: `${projects.length} projects retrieved`,
    });
  } catch (error) {
    console.error('Get projects error:', error.message);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to retrieve projects',
    });
  }
};

// Portfolio themes feature a "top 3" project slot — cap pinning to match.
const MAX_PINNED_PROJECTS = 3;

/**
 * togglePinProject — Toggles the pinned status of a project.
 * Pinning is capped at MAX_PINNED_PROJECTS so "pinned" reliably maps to the
 * top-3 project slots surfaced by the portfolio themes.
 *
 * Route: PATCH /api/profile/projects/:id/pin (protected)
 */
const togglePinProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Project not found',
      });
    }

    if (!project.pinned) {
      const pinnedCount = await Project.countDocuments({ userId: req.user._id, pinned: true });
      if (pinnedCount >= MAX_PINNED_PROJECTS) {
        return res.status(400).json({
          success: false,
          data: null,
          message: `You can only pin up to ${MAX_PINNED_PROJECTS} projects. Unpin one first.`,
        });
      }
      // New pin goes to the end of the user's chosen order.
      project.pinned = true;
      project.pinnedOrder = pinnedCount;
    } else {
      const vacatedOrder = project.pinnedOrder ?? -1;
      project.pinned = false;
      project.pinnedOrder = null;
      // Close the gap so remaining pins stay contiguous (0, 1, 2, ...).
      await Project.updateMany(
        { userId: req.user._id, pinned: true, pinnedOrder: { $gt: vacatedOrder } },
        { $inc: { pinnedOrder: -1 } }
      );
    }
    await project.save();

    res.status(200).json({
      success: true,
      data: { project },
      message: `Project ${project.pinned ? 'pinned' : 'unpinned'}`,
    });
  } catch (error) {
    console.error('Toggle pin error:', error.message);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to toggle pin status',
    });
  }
};

/**
 * reorderPinnedProjects — Sets the explicit display order of the user's
 * pinned projects. This is what decides top-project order in the public
 * portfolio — entirely the user's choice, not score or AI rank.
 *
 * Route: PATCH /api/profile/projects/pinned/reorder (protected)
 * Body: { order: [projectId1, projectId2, projectId3] } — pinned project
 *   IDs in the desired display order (must be exactly the user's current
 *   set of pinned projects, in any order as input).
 */
const reorderPinnedProjects = async (req, res) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order) || order.length === 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Body must include a non-empty "order" array of pinned project IDs.',
      });
    }

    const pinnedProjects = await Project.find({ userId: req.user._id, pinned: true });
    const pinnedIds = new Set(pinnedProjects.map((p) => String(p._id)));

    if (order.length !== pinnedIds.size || !order.every((id) => pinnedIds.has(String(id)))) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'The order array must contain exactly the set of currently pinned project IDs.',
      });
    }

    await Promise.all(
      order.map((id, index) =>
        Project.updateOne({ _id: id, userId: req.user._id }, { $set: { pinnedOrder: index } })
      )
    );

    const updated = await Project.find({ userId: req.user._id, pinned: true }).sort({ pinnedOrder: 1 });

    res.status(200).json({
      success: true,
      data: { projects: updated },
      message: 'Pinned project order updated',
    });
  } catch (error) {
    console.error('Reorder pinned projects error:', error.message);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to reorder pinned projects',
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const allowedFields = ['name', 'description', 'language', 'languages', 'repoUrl', 'score', 'pinned', 'hidden'];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: updateData },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { project },
      message: 'Project updated',
    });
  } catch (error) {
    console.error('Update project error:', error.message);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to update project',
    });
  }
};

const toggleProjectVisibility = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Project not found',
      });
    }

    project.hidden = !project.hidden;
    await project.save();

    res.status(200).json({
      success: true,
      data: { project },
      message: `Project ${project.hidden ? 'hidden' : 'shown'}`,
    });
  } catch (error) {
    console.error('Toggle project visibility error:', error.message);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Failed to toggle project visibility',
    });
  }
};

module.exports = {
  getMyProfile,
  updateProfile,
  getProjects,
  togglePinProject,
  reorderPinnedProjects,
  updateProject,
  toggleProjectVisibility,
};
