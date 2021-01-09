
from fastapi import FastAPI, Form
import httpx
import json
import uvicorn

app = FastAPI()

# Post method to intake an ip address and returns data on the IP address and ASN prefix


@app.post("/api/v1/user_input")
async def get_ip_address(ip_address: str = Form(...)):
    # Base url for obtaining information on the IP
    ip_api_request = "https://api.bgpview.io/ip/"
    ip_api_request += ip_address
    prefix_list = []
    output = {}
    async with httpx.AsyncClient(timeout=None) as client:
        ip_api_response = await client.get(ip_api_request)
        response = json.loads(ip_api_response.text)
        # Check for valid status
        if (response["status"] == "ok"):
            # store IP data onto output object
            prefixes = response["data"]["prefixes"]
            output['domain'] = response["data"]["ptr_record"]
            output['rir_allocation'] = response["data"]["rir_allocation"]
            output['iana_assignment'] = response["data"]["iana_assignment"]
            output['number_prefixes'] = len(prefixes)
            prefix_information = []
            # Identify and store IP prefixes
            for asn_prefix in prefixes:
                prefix = {}
                prefix["asn_number"] = asn_prefix["asn"]['asn']
                prefix["asn_name"] = asn_prefix["asn"]['name']
                prefix["asn_description"] = asn_prefix["asn"]['description']
                prefix["asn_country_code"] = asn_prefix["asn"]['country_code']
                prefix_list.append(asn_prefix["asn"]['asn'])
                prefix_information.append(prefix)
            output['prefix_information'] = prefix_information
        else:
            return {"response": "invalid query"}

    # Base url for obtaining information on each ASN prefix
    prefix_url = "https://api.bgpview.io/asn/"
    async with httpx.AsyncClient(timeout=None) as client:
        prefix_details = []
        for asn_number in prefix_list:
            asn_api_response = await client.get(prefix_url + str(asn_number) + "/prefixes")
            response = json.loads(asn_api_response.text)
            # Check for valid status
            if (response["status"] == "ok"):
                # Identify and store ipv4 and ipv6 addresses
                prefix = {}
                prefix['ipv4_prefixes'] = response["data"]["ipv4_prefixes"]
                prefix['ipv6_prefixes'] = response["data"]["ipv6_prefixes"]
                prefix_details.append(prefix)
            else:
                prefix_details.append("invalid")
        output['prefix_details'] = prefix_details
    return output

# Run the ASGI server


def main():
    uvicorn.run("server:app", host='0.0.0.0', port=8000, reload=True)


if __name__ == '__main__':
    main()
