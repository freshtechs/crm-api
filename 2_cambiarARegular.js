// #2 pasarlo a regular
async function cambiarClienteARegular() {
    var crmID = tempCrmID ? tempCrmID : SHEET_ESTATUS.getRange(workingRow + 1, 11).getDisplayValue()
    crmID = (+crmID)

    var body = {
        "isLead": false,
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

    var request = await UrlFetchApp.fetch(CRM_URL + "/crm/api/v1.0/clients/" + crmID, options);
    var statusCode = request.getResponseCode()
    success = (statusCode !== 401)
    return success
}