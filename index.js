const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { Reclaim } = require('@reclaimprotocol/reclaim-sdk');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Connecting to MongoDB
mongoose.connect('con_url', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Defining a Claim schema for MongoDB
const claimSchema = new mongoose.Schema({
  id: String,
  status: String,
});
const Claim = mongoose.model('Claim', claimSchema);

// Initialising Reclaim
const reclaim = new Reclaim();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// POST /generateClaim
app.post('/generateClaim', async (req, res) => {
  const { walletAddress } = req.body;

  try {
    // Generate claim using Reclaim 
    const claim = await reclaim.generateClaim(walletAddress);

    // Save claim to MongoDB database
    const newClaim = new Claim({
      id: claim.id,
      status: 'in_progress',
    });
    await newClaim.save();

    // Send back response template to TPH website
    res.json({
      claim,
    });
  } catch (error) {
    // Error hadling
    res.status(500).json({
      error: 'Claim generation failed',
    });
  }
});

// GET /claimStatus
app.get('/claimStatus', async (req, res) => {
  const { claimId } = req.query;

  try {
    // Fetch claim status from MongoDB database
    const claim = await Claim.findOne({ id: claimId });

    // Check if claim exists
    if (!claim) {
      return res.status(404).json({
        error: 'Claim not found',
      });
    }

    res.json({
      claimStatus: claim,
    });
  } catch (error) {
    // Error handling
    res.status(500).json({
      error: 'Failed to retrieve claim status',
    });
  }
});

// PUT /claimStatus
app.put('/claimStatus', async (req, res) => {
  const { claimId, status } = req.body;

  try {
    // Update  status in MongoDB database
    const claim = await Claim.findOneAndUpdate({ id: claimId }, { status }, { new: true });

    // Check ife claim exists
    if (!claim) {
      return res.status(404).json({
        error: 'Claim not found',
      });
    }

    res.json({
      message: 'Claim status updated successfully',
    });
  } catch (error) {
    // error handling
    res.status(500).json({
      error: 'Failed to update claim status',
    });
  }
});

// GET /claim
app.get('/claim', async (req, res) => {
  const { claimId } = req.query;

  try {
    // Fetch claim from MongoDB database
    const claim = await Claim.findOne({ id: claimId });

    // Check if claim exists
    if (!claim) {
      return res.status(404).json({
        error: 'Claim not found',
      });
    }

    res.json({
      claim,
    });
  } catch (error) {
    // error handling
    res.status(500).json({
      error: 'Failed to retrieve claim',
    });
  }
});

// DELETE /claim
app.delete('/claim', async (req, res) => {
  const { claimId } = req.query;

  try {
    // Delete claim from MongoDB database
    const claim = await Claim.findOneAndDelete({ id: claimId });

    // Check if claim exists
    if (!claim) {
      return res.status(404).json({
        error: 'Claim not found',
      });
    }

    res.json({
      message: 'Claim deleted successfully',
    });
  } catch (error) {
    // Error handling
    res.status(500).json({
      error: 'Failed to delete claim',
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
