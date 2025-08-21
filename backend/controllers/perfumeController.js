const { Perfume } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

const getAllPerfumes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      fragranceFamily,
      brand,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      featured,
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { isActive: true };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (fragranceFamily && fragranceFamily !== 'all') {
      where.fragranceFamily = fragranceFamily;
    }

    if (brand) {
      where.brand = { [Op.iLike]: `%${brand}%` };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    const validSortFields = ['name', 'price', 'rating', 'createdAt', 'brand'];
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows: perfumes } = await Perfume.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[orderField, orderDirection]],
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      message: 'Perfumes retrieved successfully',
      perfumes,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Get perfumes error:', error);
    res.status(500).json({
      message: 'Server error retrieving perfumes',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const getPerfumeById = async (req, res) => {
  try {
    const { id } = req.params;

    const perfume = await Perfume.findOne({
      where: { id, isActive: true },
    });

    if (!perfume) {
      return res.status(404).json({
        message: 'Perfume not found',
      });
    }

    res.json({
      message: 'Perfume retrieved successfully',
      perfume,
    });
  } catch (error) {
    console.error('Get perfume error:', error);
    res.status(500).json({
      message: 'Server error retrieving perfume',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const createPerfume = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const perfumeData = req.body;

    if (req.file) {
      perfumeData.imageUrl = `/uploads/${req.file.filename}`;
    }

    if (perfumeData.topNotes && typeof perfumeData.topNotes === 'string') {
      perfumeData.topNotes = perfumeData.topNotes.split(',').map(note => note.trim());
    }
    if (perfumeData.middleNotes && typeof perfumeData.middleNotes === 'string') {
      perfumeData.middleNotes = perfumeData.middleNotes.split(',').map(note => note.trim());
    }
    if (perfumeData.baseNotes && typeof perfumeData.baseNotes === 'string') {
      perfumeData.baseNotes = perfumeData.baseNotes.split(',').map(note => note.trim());
    }

    const perfume = await Perfume.create(perfumeData);

    res.status(201).json({
      message: 'Perfume created successfully',
      perfume,
    });
  } catch (error) {
    console.error('Create perfume error:', error);
    res.status(500).json({
      message: 'Server error creating perfume',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const updatePerfume = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    const perfume = await Perfume.findByPk(id);
    if (!perfume) {
      return res.status(404).json({
        message: 'Perfume not found',
      });
    }

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    if (updateData.topNotes && typeof updateData.topNotes === 'string') {
      updateData.topNotes = updateData.topNotes.split(',').map(note => note.trim());
    }
    if (updateData.middleNotes && typeof updateData.middleNotes === 'string') {
      updateData.middleNotes = updateData.middleNotes.split(',').map(note => note.trim());
    }
    if (updateData.baseNotes && typeof updateData.baseNotes === 'string') {
      updateData.baseNotes = updateData.baseNotes.split(',').map(note => note.trim());
    }

    await perfume.update(updateData);

    res.json({
      message: 'Perfume updated successfully',
      perfume,
    });
  } catch (error) {
    console.error('Update perfume error:', error);
    res.status(500).json({
      message: 'Server error updating perfume',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const deletePerfume = async (req, res) => {
  try {
    const { id } = req.params;

    const perfume = await Perfume.findByPk(id);
    if (!perfume) {
      return res.status(404).json({
        message: 'Perfume not found',
      });
    }

    await perfume.update({ isActive: false });

    res.json({
      message: 'Perfume deleted successfully',
    });
  } catch (error) {
    console.error('Delete perfume error:', error);
    res.status(500).json({
      message: 'Server error deleting perfume',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const getFeaturedPerfumes = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const perfumes = await Perfume.findAll({
      where: { isFeatured: true, isActive: true },
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      message: 'Featured perfumes retrieved successfully',
      perfumes,
    });
  } catch (error) {
    console.error('Get featured perfumes error:', error);
    res.status(500).json({
      message: 'Server error retrieving featured perfumes',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (typeof stock !== 'number') {
      return res.status(400).json({
        message: 'Stock must be a number',
      });
    }

    const perfume = await Perfume.findByPk(id);
    if (!perfume) {
      return res.status(404).json({
        message: 'Perfume not found',
      });
    }

    await perfume.updateStock(stock);

    res.json({
      message: 'Stock updated successfully',
      perfume,
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      message: 'Server error updating stock',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
};

module.exports = {
  getAllPerfumes,
  getPerfumeById,
  createPerfume,
  updatePerfume,
  deletePerfume,
  getFeaturedPerfumes,
  updateStock,
};