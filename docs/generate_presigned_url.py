import boto3
import os
from PIL import Image
from io import BytesIO
import logging
import json

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

s3_client = boto3.client("s3")

HEIGHT, WIDTH = 400, 400


def resize_image(image_BytesIO, height, width):
    """
    Resizes an image to a maximum dimension of 400x400 pixels.
    """
    with Image.open(image_BytesIO) as image:
        image.thumbnail((height, width))
        resized_BytesIO = BytesIO()
        image.save(resized_BytesIO, format=image.format)
        resized_BytesIO.seek(0)
        return resized_BytesIO


def get_images_records(event):
    logging.debug(event)
    # print(event)

    width = event.get("width", WIDTH)
    height = event.get("height", HEIGHT)
    event = event["Payload"]

    try:
        images_records = json.loads(event["body"])
        # height = images_records.get('height', HEIGHT)
        # width = images_records.get('width', WIDTH)
        images_records = images_records["Records"]
        return images_records, width, height
    except:
        ...

    try:
        images_records = event["Records"]
        return images_records, width, height
    except:
        ...


def handler(event, context):
    images_records, width, height = get_images_records(event)
    for record in images_records:
        # Get bucket and key from the S3 event
        upload_bucket = record["s3"]["bucket"]["name"]
        upload_key = record["s3"]["object"]["key"]
        save_key = f"resized-{width}x{height}/{upload_key}"

        logger.info(f"Downloading [[{upload_key}]] from bucket [[{upload_bucket}]].")
        # Download the file from S3 to the Lambda /tmp directory
        uploaded_img = BytesIO()
        s3_client.download_fileobj(upload_bucket, upload_key, uploaded_img)
        uploaded_img.seek(0)

        logger.info(f"Processing [[{upload_key}]].")
        # Resize the image
        resized_img = resize_image(uploaded_img, height, width)

        logger.info(f"Successfully resized [[{upload_key}]].")

        # Upload the resized image to the destination S3 bucket
        resized_bucket = os.environ["DEST_BUCKET"]
        s3_client.upload_fileobj(resized_img, resized_bucket, save_key)

        logger.info(f"Successfully uploaded to [[{resized_bucket}]].")

    return {"statusCode": 200, "body": "Image processing complete!"}
