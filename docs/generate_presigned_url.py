import boto3
import os
import logging
import json
import uuid
from base64 import b64decode

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

s3_client = boto3.client("s3")
SOURCE_BUCKET = os.environ["SOURCE_BUCKET"]


def handler(event, context):
    # print(f'{event = }')
    try:
        # Parse request body
        if event.get("isBase64Encoded", False):
            # print("body encoded b64")
            body = json.loads(b64decode(event.get("body", "{}")))
            # body = json.loads(event.get('body', '{}').encode('utf-8').decode('utf-8-sig').replace("'", '"'))
        else:
            body = json.loads(event.get("body", "{}"))

        print(f"{body = }")
        filename = body.get("filename")
        print(f"{filename = }")
        # width = body.get('width')
        # height = body.get('height')

        if not filename:  # or not width or not height:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing filename, width, or height."}),
            }

        # Generate a unique key for the S3 object to prevent overwrites
        # The "uploads/" prefix is important for triggering the other Lambda
        object_key = f"uploads/{uuid.uuid4()}-{filename}"
        print(f"{object_key = }")

        # # Metadata to be attached to the S3 object
        # metadata_fields = {
        #     "x-amz-meta-width": str(width),
        #     "x-amz-meta-height": str(height)
        # }

        # Conditions to enforce on the upload
        conditions = [
            ["starts-with", "$key", "uploads/"],
            # {"x-amz-meta-width": str(width)},
            # {"x-amz-meta-height": str(height)}
        ]

        # Generate the pre-signed POST data
        presigned_post = s3_client.generate_presigned_post(
            Bucket=SOURCE_BUCKET,
            Key=object_key,
            # Fields={**metadata_fields}, # Merge metadata into fields
            Conditions=conditions,
            ExpiresIn=3600,  # URL expires in 1 hour
        )
        print(f"{presigned_post = }")

        # Return the URL and the form fields
        return {
            "statusCode": 200,
            # CORS headers are essential for web clients
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST",
            },
            "body": json.dumps(presigned_post),
        }

    except Exception as e:
        print(e)
        return {
            "statusCode": 500,
            "error": e,
            "body": json.dumps({"error": "Failed to generate pre-signed URL."}),
        }
