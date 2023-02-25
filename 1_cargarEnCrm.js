// #1 cargar cliente como potencial en CRM
async function singleCrearClientePotencial(nombreYApellido, edificio, numApto, correo, telefono, cedula) {

    var [firstName, lastName] = nombreYApellido.split(' ');
    correo = correo.toLowerCase();
    var fullAddress = "Av. Francisco Solano, Sans Souci, " + "Edif. " + edificio + " apto #" + numApto + ", Chacao, Edo. Miranda"
    var body = {
        "isLead": true,
        "clientType": 1,
        "firstName": firstName,
        "lastName": lastName,
        "street1": fullAddress,
        "city": "Caracas",
        "countryId": 254,
        "zipCode": "1060",
        "fullAddress": fullAddress,
        "invoiceAddressSameAsContact": true,
        "organizationId": 1,
        //"tax1Id":                       1,
        "username": correo,
        "addressGpsLat": 0,
        "addressGpsLon": 0,
        "contacts": [{
            "email": correo,
            "phone": "+58" + telefono.substring(1),
            "name": nombreYApellido,
            "isBilling": true,     //billing
            "isContact": true,     //general
            //"types": 
            //  [{
            //  "name":                     "Contacto"
            //  }]
        }],
        "attributes": [{
            "customAttributeId": 5,
            "value": "1"
        },
        {
            "customAttributeId": 6, "value": cedula
        }
        ],
        "addressData": {
            "type": "GoogleMaps",
            "formattedAddress": fullAddress,
            "latitude": 0,
            "longitude": 0,
            "addressComponents": []
        }
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
    var request = await UrlFetchApp.fetch(CRM_URL + "/crm/api/v1.0/clients", options);
    var statusCode = request.getResponseCode()
    var responseBody = request.getContentText()
    success = (statusCode === 201 && responseBody.includes('id') && responseBody.includes('clientId'))
    var crmID = String(request).split('"id":');
    crmID = crmID[1].split(',"userIdent":');
    crmID = crmID[0];

    crmID = success ? crmID : null
    // este crmID lo guardaba en el sheet de drive y lo usaba para nuevos requests.
    return (crmID)
}