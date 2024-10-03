import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const StoreSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters long")
    .required("Store name is required"),
});

const EditStorePage = () => {
  const { id } = useParams();
  const [store, setStore] = React.useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/stores/${id}`)
      .then((response) => setStore(response.data))
      .catch((error) => console.error("Error fetching store:", error));
  }, [id]);

  const handleSubmit = (values) => {
    axios
      .put(`/api/stores/${id}`, values)
      .then((response) => {
        console.log("Store updated:", response.data);
        navigate(`/stores/${id}`);
      })
      .catch((error) => {
        console.error("Error updating store:", error);
        alert("Failed to update store. Please try again.");
      });
  };
  

  const handleClick = () => {
    fetch(`/api/stores/${id}`, {
      method: "DELETE",
    })
      .catch((err) => console.error("Error deleting store:", err))
      .then(() => {
        window.location.href = "/stores";
      });
  };

  if (!store) return <div>Loading...</div>;

  return (
    <div>
      <h2>Edit Store</h2>
      <button onClick={handleClick} className="btn">
        Delete
      </button>
      <Formik
        initialValues={{ name: store.name }}
        validationSchema={StoreSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="name">Store Name</label>
              <Field name="name" type="text" />
              <ErrorMessage name="name" component="div" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Update Store
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditStorePage;
