class CityDTO {
  constructor(city) {
    this._id = city._id;
    this.cityName = city.cityName;
    this.stateName = city.stateId.stateName;
    this.status = city.status;
    this.createdAt = city.createdAt;
  }
}

module.exports = CityDTO;
