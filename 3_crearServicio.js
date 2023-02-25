// # 3 Crear un servicio y asociarlo al cliente existente
async function crearServicio() {
    var crmID = tempCrmID ? tempCrmID : SHEET_ESTATUS.getRange(workingRow + 1, 11).getDisplayValue()
    crmID = (+crmID)

    console.log("Fecha de instalacion is:", fechaDeInstalacion)
    // var desiredDate = Utilities.formatDate(fechaDeInstalacion, "UTC", "yyyy-MM-dd'T'HH:mm:ss'+0000'");
    // Logger.log(desiredDate)
    servicioContratadoId = getCrmServiceId()
    var body = {
        "servicePlanPeriodId": servicioContratadoId,
        "sendEmailsAutomatically": false,
        "useCreditAutomatically": true,
        // "invoicingStart": desiredDate,
        "isQuoted": false
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

    var url = CRM_URL + "/crm/api/v1.0/clients/" + crmID + "/services"
    Logger.log(url)
    var request = await UrlFetchApp.fetch(url, options);
    Logger.log(request)
    var statusCode = request.getResponseCode()
    var responseBody = request.getContentText()
    Logger.log(responseBody)
    success = (statusCode === 201 && responseBody.includes('id') && responseBody.includes('clientId'))
    var serviceID = String(request).split('"id":');
    serviceID = serviceID[1].split(',"prepaid":');
    serviceID = serviceID[0];

    serviceID = success ? serviceID : null
    // este serviceID lo guardaba en el sheet de drive y lo usaba para nuevos requests.
    return (serviceID)
}

function getCrmServiceId() {
    var servicioContratadoId;
    if (serviciosContratados.includes("TV")) {
        var servicioInternet = ''
        servicioInternet = serviciosContratados.split(',')[0]

        if (servicioInternet.includes("60 Mbps")) {
            servicioContratadoId = servicePlan60MbpsTvId
        } else if (servicioInternet.includes("100 Mbps")) {
            servicioContratadoId = servicePlan100MbpsTvId
        } else {
            servicioContratadoId = servicePlan200MbpsTvId
        }

    } else {

        if (serviciosContratados.includes("60 Mbps")) {
            servicioContratadoId = servicePlan60MbpsId
        } else if (serviciosContratados.includes("100 Mbps")) {
            servicioContratadoId = servicePlan100MbpsId
        } else {
            servicioContratadoId = servicePlan200MbpsId
        }
    }
    return servicioContratadoId
}
