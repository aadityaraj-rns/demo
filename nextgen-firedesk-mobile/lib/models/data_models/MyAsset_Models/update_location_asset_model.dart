// To parse this JSON data, do
//
//     final updateLocationAssetDetails = updateLocationAssetDetailsFromJson(jsonString);

import 'dart:convert';

UpdateLocationAssetDetails updateLocationAssetDetailsFromJson(String str) => UpdateLocationAssetDetails.fromJson(json.decode(str));

String updateLocationAssetDetailsToJson(UpdateLocationAssetDetails data) => json.encode(data.toJson());

class UpdateLocationAssetDetails {
    Asset? asset;
    String? message;

    UpdateLocationAssetDetails({
        this.asset,
        this.message,
    });

    factory UpdateLocationAssetDetails.fromJson(Map<String, dynamic> json) => UpdateLocationAssetDetails(
        asset: json["asset"] == null ? null : Asset.fromJson(json["asset"]),
        message: json["message"],
    );

    Map<String, dynamic> toJson() => {
        "asset": asset?.toJson(),
        "message": message,
    };
}

class Asset {
    ServiceDates? serviceDates;
    String? id;
    String? assetId;
    String? plantId;
    String? building;
    String? productCategoryId;
    String? productId;
    int? capacity;
    String? location;
    String? orgUserId;
    String? technicianUserId;
    String? model;
    String? slNo;
    String? pressureRating;
    String? pressureUnit;
    String? moc;
    String? approval;
    String? fireClass;
    DateTime? manufacturingDate;
    DateTime? installDate;
    String? suctionSize;
    String? head;
    String? rpm;
    String? mocOfImpeller;
    String? fuelCapacity;
    String? flowInLpm;
    String? housePower;
    String? healthStatus;
    String? tag;
    String? status;
    String? manufacturerName;
    DateTime? hpTestOn;
    String? nextHpTestDue;
    List<Oldlatlong>? oldlatlongs;
    String? document1;
    String? document2;
    DateTime? createdAt;
    DateTime? updatedAt;
    int? v;
    String? qrCodeUrl;
    String? lat;
    String? long;
    String? latLongRemark;

    Asset({
        this.serviceDates,
        this.id,
        this.assetId,
        this.plantId,
        this.building,
        this.productCategoryId,
        this.productId,
        this.capacity,
        this.location,
        this.orgUserId,
        this.technicianUserId,
        this.model,
        this.slNo,
        this.pressureRating,
        this.pressureUnit,
        this.moc,
        this.approval,
        this.fireClass,
        this.manufacturingDate,
        this.installDate,
        this.suctionSize,
        this.head,
        this.rpm,
        this.mocOfImpeller,
        this.fuelCapacity,
        this.flowInLpm,
        this.housePower,
        this.healthStatus,
        this.tag,
        this.status,
        this.manufacturerName,
        this.hpTestOn,
        this.nextHpTestDue,
        this.oldlatlongs,
        this.document1,
        this.document2,
        this.createdAt,
        this.updatedAt,
        this.v,
        this.qrCodeUrl,
        this.lat,
        this.long,
        this.latLongRemark,
    });

    factory Asset.fromJson(Map<String, dynamic> json) => Asset(
        serviceDates: json["serviceDates"] == null ? null : ServiceDates.fromJson(json["serviceDates"]),
        id: json["_id"],
        assetId: json["assetId"],
        plantId: json["plantId"],
        building: json["building"],
        productCategoryId: json["productCategoryId"],
        productId: json["productId"],
        capacity: json["capacity"],
        location: json["location"],
        orgUserId: json["orgUserId"],
        technicianUserId: json["technicianUserId"],
        model: json["model"],
        slNo: json["slNo"],
        pressureRating: json["pressureRating"],
        pressureUnit: json["pressureUnit"],
        moc: json["moc"],
        approval: json["approval"],
        fireClass: json["fireClass"],
        manufacturingDate: json["manufacturingDate"] == null ? null : DateTime.parse(json["manufacturingDate"]),
        installDate: json["installDate"] == null ? null : DateTime.parse(json["installDate"]),
        suctionSize: json["suctionSize"],
        head: json["head"],
        rpm: json["rpm"],
        mocOfImpeller: json["mocOfImpeller"],
        fuelCapacity: json["fuelCapacity"],
        flowInLpm: json["flowInLpm"],
        housePower: json["housePower"],
        healthStatus: json["healthStatus"],
        tag: json["tag"],
        status: json["status"],
        manufacturerName: json["manufacturerName"],
        hpTestOn: json["hpTestOn"] == null ? null : DateTime.parse(json["hpTestOn"]),
        nextHpTestDue: json["nextHpTestDue"],
        oldlatlongs: json["oldlatlongs"] == null ? [] : List<Oldlatlong>.from(json["oldlatlongs"]!.map((x) => Oldlatlong.fromJson(x))),
        document1: json["document1"],
        document2: json["document2"],
        createdAt: json["createdAt"] == null ? null : DateTime.parse(json["createdAt"]),
        updatedAt: json["updatedAt"] == null ? null : DateTime.parse(json["updatedAt"]),
        v: json["__v"],
        qrCodeUrl: json["qrCodeUrl"],
        lat: json["lat"],
        long: json["long"],
        latLongRemark: json["latLongRemark"],
    );

    Map<String, dynamic> toJson() => {
        "serviceDates": serviceDates?.toJson(),
        "_id": id,
        "assetId": assetId,
        "plantId": plantId,
        "building": building,
        "productCategoryId": productCategoryId,
        "productId": productId,
        "capacity": capacity,
        "location": location,
        "orgUserId": orgUserId,
        "technicianUserId": technicianUserId,
        "model": model,
        "slNo": slNo,
        "pressureRating": pressureRating,
        "pressureUnit": pressureUnit,
        "moc": moc,
        "approval": approval,
        "fireClass": fireClass,
        "manufacturingDate": manufacturingDate?.toIso8601String(),
        "installDate": installDate?.toIso8601String(),
        "suctionSize": suctionSize,
        "head": head,
        "rpm": rpm,
        "mocOfImpeller": mocOfImpeller,
        "fuelCapacity": fuelCapacity,
        "flowInLpm": flowInLpm,
        "housePower": housePower,
        "healthStatus": healthStatus,
        "tag": tag,
        "status": status,
        "manufacturerName": manufacturerName,
        "hpTestOn": hpTestOn?.toIso8601String(),
        "nextHpTestDue": nextHpTestDue,
        "oldlatlongs": oldlatlongs == null ? [] : List<dynamic>.from(oldlatlongs!.map((x) => x.toJson())),
        "document1": document1,
        "document2": document2,
        "createdAt": createdAt?.toIso8601String(),
        "updatedAt": updatedAt?.toIso8601String(),
        "__v": v,
        "qrCodeUrl": qrCodeUrl,
        "lat": lat,
        "long": long,
        "latLongRemark": latLongRemark,
    };
}

class Oldlatlong {
    String? plantId;
    String? building;
    String? location;
    String? lat;
    String? long;
    String? id;

    Oldlatlong({
        this.plantId,
        this.building,
        this.location,
        this.lat,
        this.long,
        this.id,
    });

    factory Oldlatlong.fromJson(Map<String, dynamic> json) => Oldlatlong(
        plantId: json["plantId"],
        building: json["building"],
        location: json["location"],
        lat: json["lat"],
        long: json["long"],
        id: json["_id"],
    );

    Map<String, dynamic> toJson() => {
        "plantId": plantId,
        "building": building,
        "location": location,
        "lat": lat,
        "long": long,
        "_id": id,
    };
}

class ServiceDates {
    TServiceDates? lastServiceDates;
    TServiceDates? nextServiceDates;

    ServiceDates({
        this.lastServiceDates,
        this.nextServiceDates,
    });

    factory ServiceDates.fromJson(Map<String, dynamic> json) => ServiceDates(
        lastServiceDates: json["lastServiceDates"] == null ? null : TServiceDates.fromJson(json["lastServiceDates"]),
        nextServiceDates: json["nextServiceDates"] == null ? null : TServiceDates.fromJson(json["nextServiceDates"]),
    );

    Map<String, dynamic> toJson() => {
        "lastServiceDates": lastServiceDates?.toJson(),
        "nextServiceDates": nextServiceDates?.toJson(),
    };
}

class TServiceDates {
    DateTime? inspection;
    DateTime? testing;
    DateTime? maintenance;
    String? id;

    TServiceDates({
        this.inspection,
        this.testing,
        this.maintenance,
        this.id,
    });

    factory TServiceDates.fromJson(Map<String, dynamic> json) => TServiceDates(
        inspection: json["inspection"] == null ? null : DateTime.parse(json["inspection"]),
        testing: json["testing"] == null ? null : DateTime.parse(json["testing"]),
        maintenance: json["maintenance"] == null ? null : DateTime.parse(json["maintenance"]),
        id: json["_id"],
    );

    Map<String, dynamic> toJson() => {
        "inspection": inspection?.toIso8601String(),
        "testing": testing?.toIso8601String(),
        "maintenance": maintenance?.toIso8601String(),
        "_id": id,
    };
}
