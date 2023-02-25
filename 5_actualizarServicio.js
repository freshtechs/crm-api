async function actualizarServicio() {
    var serviceId = SHEET_ESTATUS.getRange(workingRow + 1, 14).getDisplayValue()
    serviceId = (+serviceId)
    var url = CRM_URL + "/crm/api/v1.0/clients/" + "services/" + serviceId

    var body = {
        "sendEmailsAutomatically": true,
    }
    var headers = {
        "Accept": "application/json",
        "X-Auth-App-Key": CRM_API_KEY
    }
    var options = {
        "headers": headers,
        "contentType": "application/json",
        "method": "patch",
        "payload": JSON.stringify(body),
        "validateHttpsCertificates": false
    }


    var request = await UrlFetchApp.fetch(url, options);
    var statusCode = request.getResponseCode()
    var responseBody = request.getContentText()
    success = (statusCode === 200 && responseBody.includes('id') && responseBody.includes('clientId'))
    var serviceID = String(request).split('"id":');
    serviceID = serviceID[1].split(',"prepaid":');
    serviceID = serviceID[0];

    serviceID = success ? serviceID : null
    return (serviceID)
}