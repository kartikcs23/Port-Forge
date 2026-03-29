const Profile = require('../models/Profile');
const Project = require('../models/Project');

/**
 * getMyProfile — Returns the authenticated user's profile.
 *
 * Route: GET /api/profile/me (protected)
 */
const getMyProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      // Auto-create an empty profile
      profile = await Profile.create({ userId: req.user._id });
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
    const { bio, location, experience, education, skills, links } = req.body;

    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (experience !== undefined) updateData.experience = experience;
    if (education !== undefined) updateData.education = education;
    if (skills !== undefined) updateData.skills = skills;
    if (links !== undefined) updateData.links = links;

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updateData },
      { new: true, upsert: true }
    );

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

/**
 * togglePinProject — Toggles the pinned status of a project.
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

    project.pinned = !project.pinned;
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

module.exports = { getMyProfile, updateProfile, getProjects, togglePinProject };
