const Joi = require("joi");
const City = require("../../../models/admin/masterData/city");
const State = require("../../../models/admin/masterData/state");
const CityDTO = require("../../../dto/city");

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const cityController = {
  async create(req, res, next) {
    const createCitySchema = Joi.object({
      cityName: Joi.string().required(),
      stateName: Joi.string().required(),
    });
    const { error } = createCitySchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { cityName, stateName } = req.body;
    const state = await State.findOne({ stateName });
    const stateId = state._id;

    const findCity = await City.findOne({ cityName, stateId });
    if (findCity) {
      const error = {
        status: 400,
        message: "City name already exist",
      };
      return next(error);
    }
    let newCity;
    try {
      newCity = new City({
        cityName,
        stateId,
      });
      await newCity.save();
    } catch (error) {
      return next(error);
    }
    return res.json({ newCity });
  },

  async getAll(req, res, next) {
    try {
      const allCity = await City.find({})
        .populate("stateId")
        .sort({ createdAt: -1 });
      const allCityDTO = allCity.map((city) => new CityDTO(city));
      return res.json({ allCity: allCityDTO });
    } catch (error) {
      return next(error);
    }
  },
  async update(req, res, next) {
    const updateCitySchema = Joi.object({
      _id: Joi.string().pattern(mongodbIdPattern).required(),
      cityName: Joi.string().required(),
      stateName: Joi.string().required(),
      status: Joi.string().required(),
    });

    const { error } = updateCitySchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { cityName, stateName, _id, status } = req.body;

    const state = await State.findOne({ stateName });
    const stateId = state._id;
    const findCity = await City.findOne({ cityName, stateId });
    if (findCity) {
      const error = {
        status: 400,
        message: "City name already exist",
      };
      return next(error);
    }

    await City.updateOne(
      {
        _id,
      },
      {
        cityName,
        stateId: state._id,
        status,
      }
    );

    return res.json({ msg: "updated successfully" });
  },
  async getByStateName(req, res, next) {
    const { stateName } = req.params;

    try {
      const state = await State.findOne({ stateName });

      const cities = await City.find({ stateId: state._id }).populate(
        "stateId"
      );

      const cityDTO = cities.map((city) => new CityDTO(city));
      return res.json({ cities: cityDTO });
    } catch (error) {
      return next(error);
    }
  },
  async activeCities(req, res, next) {
    try {
      const cities = await City.find({ status: "Active" }).populate("stateId");
      const cityDTO = cities.map((city) => new CityDTO(city));
      return res.json({ cities: cityDTO });
    } catch (error) {
      return next(error);
    }
  },
  async getActiveCitysByStateName(req, res, next) {
    const { stateName } = req.params;

    try {
      const state = await State.findOne({ stateName });

      const cities = await City.find({
        stateId: state._id,
        status: "Active",
      }).populate("stateId");

      const cityDTO = cities.map((city) => new CityDTO(city));
      return res.json({ cities: cityDTO });
    } catch (error) {
      return next(error);
    }
  },
  async getByStateId(req, res, next) {
    const { stateId } = req.params;
    try {
      const cities = await City.find({ stateId }).populate("stateId");
      const cityDTO = cities.map((city) => new CityDTO(city));
      return res.json({ cities: cityDTO });
    } catch (error) {
      return next(error);
    }
  },
  async getActivecitysByStateId(req, res, next) {
    const { stateId } = req.params;
    try {
      const cities = await City.find({ stateId, status: "Active" }).populate(
        "stateId"
      );
      const cityDTO = cities.map((city) => new CityDTO(city));
      return res.json({ cities: cityDTO });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = cityController;
