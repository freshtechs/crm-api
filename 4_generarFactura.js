// #4 Generar primera factura
async function generarPrimeraFactura(serviceId) {
    montoInstalacion = (+montoInstalacion)
    serviceId = (+serviceId)

    var crmID = tempCrmID ? tempCrmID : SHEET_ESTATUS.getRange(workingRow + 1, 11).getDisplayValue()
    crmID = (+crmID)

    var url = CRM_URL + "/crm/api/v1.0/clients/" + crmID + "/invoices"

    var body = {
        "items": [
            {
                "label": "Instalación del Servicio de Internet",
                "price": montoInstalacion,
                "quantity": 1

            },
            {
                "serviceId": serviceId
            }
        ]
    }

    var headers = {
        "Accept": "application/json",
        "X-Auth-App-Key": CRM_API_KEY
    }
    var options = {
        "headers": headers,
        "contentType": "application/json",
        "method": "post",
        "payload": JSON.stringify(body),
        "validateHttpsCertificates": false
    }
    Logger.log('generando factura')
    var request = await UrlFetchApp.fetch(url, options);
    Logger.log(request)
    var statusCode = request.getResponseCode()
    var responseBody = request.getContentText()
    success = (statusCode === 201 && responseBody.includes('id') && responseBody.includes('dueDate'))
    var facturaId = String(request).split('"id":');
    facturaId = facturaId[1].split(',"clientId":');
    facturaId = facturaId[0];

    facturaId = success ? facturaId : null
    var secondOptions = {
        "headers": headers,
        "contentType": "application/json",
        "method": "patch",
        "validateHttpsCertificates": false
    }
    // 'Descomentar lo de abajo para que se envie y apruebe la factura automaticamente'
    // var secondURL = CRM_URL + "/crm/api/v1.0/invoices/" + facturaId + "/send"
    // UrlFetchApp.fetch(secondURL, secondOptions)
    return (facturaId)
}