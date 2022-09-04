import time
import json
import requests
import base64

###############################################################################################
# Initialize the gRPC-based client to communicate with the Clarifai platform.
###############################################################################################

# !python -m pip install clarifai-grpc

# Import the Clarifai gRPC-based objects needed
from clarifai_grpc.channel.clarifai_channel import ClarifaiChannel
from clarifai_grpc.grpc.api import resources_pb2, service_pb2, service_pb2_grpc
from clarifai_grpc.grpc.api.status import status_pb2, status_code_pb2

# Construct the communications channel 
channel = ClarifaiChannel.get_grpc_channel()
# Construct the V2Stub object for accessing all the Clarifai API functionality
stub = service_pb2_grpc.V2Stub(channel)

##############################################################################################
# This is where you set up the metadata object that's used to authenticate. 
# This authorization will be used by every Clarifai API call.
# Change the following authorization key to your own credentials
# Example: metadata = (('authorization', 'Key ' + 'a123457612345678'),)
##############################################################################################
 
metadata = (('authorization', 'Key ' + 'cd34f53643834a96a4135c856a72aac6'),)
# Or, if you were to use an API Key:
# metadata = (('authorization', 'Key ' + 'YOUR_CLARIFAI_API_KEY_HERE'),)
# Yes, the word 'Key' appears in addition to the alphanumeric PAT or API Key

##############################################################################################
# A UserAppIDSet object is needed when using a PAT. It contains two pieces of information: 
# user_id (your user id) and app_id (app id that contains the model of interest). 
# Both of them are specified as string values.
##############################################################################################

userDataObject = resources_pb2.UserAppIDSet(user_id='clarech712', app_id='my-first-application')


# Insert here the initialization code as outlined on this page:
# https://docs.clarifai.com/api-guide/api-overview/api-clients#client-installation-instructions

def analyze(file_bytes: bytes):
    post_model_outputs_response = stub.PostModelOutputs(
        service_pb2.PostModelOutputsRequest(
            user_app_id=userDataObject,  # The userDataObject is created in the overview and is required when using a PAT
            model_id="food-item-recognition",  # This is model ID of the clarifai/main General model.
            version_id="1d5fd481e0cf4826aa72ec3ff049e044",  # This is optional. Defaults to the latest model version.
            inputs=[
                resources_pb2.Input(
                    data=resources_pb2.Data(
                        image=resources_pb2.Image(
                            base64=file_bytes
                        )
                    )
                )
            ]
        ),
        metadata=metadata
    )

    #print(post_model_outputs_response)

    if post_model_outputs_response.status.code != status_code_pb2.SUCCESS:
        print("There was an error with your request!")
        print("\tCode: {}".format(post_model_outputs_response.outputs[0].status.code))
        print("\tDescription: {}".format(post_model_outputs_response.outputs[0].status.description))
        print("\tDetails: {}".format(post_model_outputs_response.outputs[0].status.details))
        raise Exception("Post model outputs failed, status: " + post_model_outputs_response.status.description)

    # Since we have one input, one output will exist here.
    output = post_model_outputs_response.outputs[0]

    #print("Predicted concepts:")
    #for concept in output.data.concepts:
    #    print("\t%s %.2f" % (concept.name, concept.value))

    top_ten_guesses = []
    for concept in output.data.concepts[:10]:
        top_ten_guesses.append((concept.name, concept.value))

    return top_ten_guesses

def main():
    origin = "https://peaceful-caterpillar-34.convex.cloud";
    url = f"{origin}/api/0.1.9/udf?path=listFoodItems&args={json.dumps([])}"
    items = requests.get(url).json()["value"]
    token_file = open("token.txt", "r")
    token = token_file.read().strip()
    token_file.close()
    for item in items:
        if "photo" not in item:
            continue
        if "keywords" in item:
            continue
        file_bytes = base64.b64decode(item["photo"][len("data:image/jpeg;base64,"):])
        keywords = analyze(file_bytes)
        url = f"{origin}/api/0.1.9/udf"
        id = item["_id"]["$id"]
        print(f"Analyzed {id}: {[keyword[0] for keyword in keywords]}")
        requests.post(url, json={
            "path": "provideKeywordsForFoodItem",
            "args": [
                id, # ID of item
                [{"name": keyword[0], "value": keyword[1]} for keyword in keywords], # keywords
                token # token so that only we can provide keywords
            ],
        })

if __name__ == "__main__":
    while True:
        main()
        time.sleep(10)