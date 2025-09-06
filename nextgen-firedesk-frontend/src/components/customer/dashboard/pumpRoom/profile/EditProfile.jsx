import * as Yup from "yup";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import {
  editCustomerProfile,
  getOrgProfile,
} from "../../../../../api/organization/internal";
import userimg from "../../../../../assets/images/profile/Profile.jpeg";
import { showAlert } from "../../../../../components/common/showAlert";
import { useDispatch } from "react-redux";
import { setUser } from "../../../../../store/userSlice";
import FormikTextField from "../../../../../components/common/InputBox/FormikTextField";
import { Link } from "react-router-dom";
import Spinner from "../../../../../pages/admin/spinner/Spinner";

export default function EditProfile() {
  const [formData, setFormData] = useState({
    name: "",
    contactNo: "",
    email: "",
    address: "",
    city: "",
    state: "",
    gst: "",
    pincode: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [orgProfile, setOrgProfile] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchData = async () => {
    setLoading(true);
    const response = await getOrgProfile();
    if (response.status === 200) {
      setOrgProfile(response.data.organization);
      setImageSrc(response.data.organization.userId.profile);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);
  const schema = Yup.object({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
    contactNo: Yup.string()
      .matches(/^\d{10,15}$/, "Contact must be 10 to 15 digits")
      .required("Contact is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    cityId: Yup.string().required("City is required"),
    address: Yup.string()
      .min(5, "Address must be at least 5 characters")
      .required("Address is required"),
    gst: Yup.string().notRequired(),
    pincode: Yup.string()
      .matches(/^\d{5,6}$/, "Pincode must be 5 or 6 digits")
      .required("Pincode is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: orgProfile?.userId?.name || "",
      contactNo: orgProfile?.userId?.phone || "",
      email: orgProfile?.userId?.email || "",
      cityId: orgProfile?.cityId?.cityName || "",
      stateId: orgProfile?.cityId?.stateId?.stateName || "",
      address: orgProfile?.address || "",
      gst: orgProfile?.gst || "",
      pincode: orgProfile?.pincode || "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("_id", orgProfile?.userId?._id);
      formData.append("userType", orgProfile?.userId?.userType);
      formData.append("name", values.name);
      formData.append("phone", values.contactNo);
      formData.append("email", values.email);
      if (values.cityId) formData.append("cityId", values.cityId);
      if (values.address) formData.append("address", values.address);
      if (values.gst) formData.append("gst", values.gst);
      if (values.currentPassword)
        formData.append("currentPassword", values.currentPassword);
      if (values.newPassword)
        formData.append("newPassword", values.newPassword);
      if (values.cNewPassword)
        formData.append("cNewPassword", values.cNewPassword);
      if (values.pincode) formData.append("pincode", values.pincode);

      const profileImageInput = document.getElementById("user-profile-image");
      const file = profileImageInput.files[0];
      if (file) {
        formData.append("profile", file);
      }

      try {
        const response = await editCustomerProfile(formData);
        if (response && response.status === 200) {
          showAlert({
            text: "Profile data updated successfully",
            icon: "success",
          });
          const customer = {
            _id: response.data.organization?._id,
            userType: response.data.organization.userType,
            loginID: response.data.organization.loginID,
            displayName: response.data.organization.displayName,
            name: response.data.organization.name,
            phone: response.data.organization.phone,
            email: response.data.organization.email,
            profile: response.data.organization.profile,
            auth: response.data.auth,
          };
          dispatch(setUser(customer));
        } else {
          showAlert({
            text: response.data.message,
            icon: "error",
          });
        }
      } catch (error) {
        showAlert({
          text: error.message,
          icon: "error",
        });
      }
    },
  });

  const handleProfileImageUpload = () => {
    const profile = document.getElementById("user-profile-image");
    profile.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <form
      className="w-full font-[Figtree] bg-gray-50"
      onSubmit={formik.handleSubmit}
    >
      <div className="w-full">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm p-3">
          <Link to="/customer" className="text-black">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span>Profile</span>
        </div>
        {/* <Breadcrumb title="Profile & Settings" items={BCrumb} /> */}

        {/* Header */}
        <div className="p-3">
          <p className="text-xl md:text-4xl font-medium md:font-semibold mb-2">
            Edit Profile
          </p>
          <p className="text-xs md:text-lg text-[#727272]">
            Update your company details and contact information below.
          </p>
        </div>

        {/* Profile Image Section */}
        <div className="p-3 mb-3">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 border-1 rounded-full flex items-center justify-center">
              <div className="w-20 h-20 flex items-center justify-center">
                <img
                  src={imageSrc ? imageSrc : userimg}
                  alt="Profile"
                  className="cursor-pointer w-fit h-fit max-w-18 max-h-18 overflow-hidden rounded-full"
                  onClick={handleProfileImageUpload}
                />
                <input
                  type="file"
                  accept="image/*"
                  id="user-profile-image"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <p
              id="profile"
              className="px-4 py-2 bg-black text-white rounded-3 text-base hover:bg-gray-700 transition-colors cursor-pointer"
              onClick={handleProfileImageUpload}
            >
              Upload
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="rounded-lg p-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            {/* Organization Details */}
            <div className="bg-white p-3 rounded-5">
              <p className="text-xl font-medium text-black mb-3">
                Organization Details
              </p>

              <div className="space-y-4">
                <div className="flex gap-8">
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Name
                    </label>
                    <FormikTextField
                      id="name"
                      formik={formik}
                      onChange={handleInputChange}
                      placeholder="Eg: Joe cole"
                      className="w-full border border-gray-300 rounded-lg bg-[#E9E9E9] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Contact No.
                    </label>
                    <FormikTextField
                      id="contactNo"
                      formik={formik}
                      placeholder="Eg: 9968776655"
                      className="w-full border border-gray-300 rounded-lg bg-[#E9E9E9] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Email
                  </label>
                  <FormikTextField
                    id="email"
                    formik={formik}
                    placeholder="Eg: joe@gmail.com"
                    className="w-full border border-gray-300 rounded-lg bg-[#E9E9E9] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    GST
                  </label>
                  <FormikTextField
                    id="gst"
                    formik={formik}
                    placeholder="Enter GST number"
                    className="w-full border border-gray-300 rounded-lg bg-[#E9E9E9] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="bg-white p-3 rounded-5">
              <p className="text-xl font-medium text-black mb-3">
                Location Details
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Address
                  </label>
                  <FormikTextField
                    id="address"
                    formik={formik}
                    placeholder="Enter Address"
                    className="w-full border border-gray-300 rounded-lg bg-[#E9E9E9] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      City
                    </label>
                    <FormikTextField
                      id="cityId"
                      formik={formik}
                      placeholder="Enter City"
                      className="w-full border border-gray-300 rounded-lg bg-[#E9E9E9] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      State
                    </label>
                    <FormikTextField
                      id="stateId"
                      formik={formik}
                      placeholder="Enter State"
                      className="w-full border border-gray-300 rounded-lg bg-[#E9E9E9] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Pincode
                  </label>
                  <FormikTextField
                    id="pincode"
                    formik={formik}
                    placeholder="Eg: 110044"
                    className="w-full border border-gray-300 rounded-lg bg-[#E9E9E9] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Save Button */}
      <div className="flex justify-center md:justify-end w-full mt-2 md:mt-8 pb-8">
        <button
          type="submit"
          className="py-2 bg-[#FF6B2C] w-[80vw] md:w-[20vw] text-base text-white rounded-4 font-medium hover:bg-orange-600 transition-colors"
          disabled={formik.isSubmitting}
        >
          Save
        </button>
      </div>
    </form>
  );
}
