from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from reclaim_sdk import ReclaimSDK

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'  # Replace with your actual database URL
db = SQLAlchemy(app)

# ClaimStatus model
class ClaimStatus(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    claim_id = db.Column(db.String(255))
    status = db.Column(db.String(50))

# POST /generateClaim
@app.route("/generateClaim", methods=["POST"])
def generate_claim():
    
    # Get the users Twitter handle from the request body
    twitter_handle = request.json["twitter_handle"]

    # Create a new claim using the Reclaim SDK
    claim = reclaim_sdk.create_claim(twitter_handle)

    # Return the claim information as a JSON response
    return jsonify(claim)

# GET /claimStatus
@app.route("/claimStatus", methods=["GET"])
def get_claim_status():
    # Get the claim ID from the request parameters
    claim_id = request.args.get("claim_id")

    # Quering database 
    claim_status = ClaimStatus.query.filter_by(claim_id=claim_id).first()

    # Returning claim
    if claim_status:
        return jsonify({"status": claim_status.status})
    else:
        return jsonify({"status": "not_found"})

# UPDATE /claimStatus
@app.route("/updateClaimStatus", methods=["PUT"])
def update_claim_status():
    # Get the claim ID and status from request body
    claim_id = request.json["claim_id"]
    status = request.json["status"]

    # Query database to find claim status
    claim_status = ClaimStatus.query.filter_by(claim_id=claim_id).first()

    if claim_status:
        # Update the existing claim status
        claim_status.status = status
    else:
        # Create a new claim status entry
        claim_status = ClaimStatus(claim_id=claim_id, status=status)
        db.session.add(claim_status)

    # Db changes
    db.session.commit()

    #success response
    return jsonify({"message": "Claim status updated successfully"})

if __name__ == "__main__":
    app.run(debug=True)
