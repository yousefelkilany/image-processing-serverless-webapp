import json
import boto3

step_function_url = (
    "arn:aws:states:us-east-1:084828586375:stateMachine:ImageResizeStep-SAA-Manara"
)

client = boto3.client("stepfunctions")


def handler(event, context):
    print(f"{event = }")
    print(f"{context = }")

    response = client.start_execution(
        stateMachineArn=step_function_url,
        name=context.aws_request_id,
        input=json.dumps(event),
    )
    print(response)
