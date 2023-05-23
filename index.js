const xano = require("@xano/js-sdk");
const { Reclaim } = require("@reclaimprotocol/reclaim-sdk");

const client = new xano.Client("Enter_Xano_API_Key_Here");

// POST /generateClaim
exports.generateClaim = async (req, res) => {
  const { walletAddress } = req.body;

  // Generate claim from Reclaim SDK
  const claim = await Reclaim.generateClaim(walletAddress);

  // Send back the response template to the TPH website
  res.json({
    claim,
  });
};

// GET /claimStatus
exports.getClaimStatus = async (req, res) => {
  const { claimId } = req.query;

  // Fetch the claim status
  const claimStatus = await client.query("SELECT * FROM claims WHERE id = ?", claimId);

  // Loading UI on webflow
  res.json({
    claimStatus,
  });
};

// UPDATE /claimStatus
exports.updateClaimStatus = async (req, res) => {
  const { claimId, status } = req.body;

  // Update the claim after the user has completed the claim in Reclaim
  await client.query("UPDATE claims SET status = ? WHERE id = ?", status, claimId);

  // Redirect to the success or failure page
  res.redirect(status === "success" ? "/success" : "/failure");
};
