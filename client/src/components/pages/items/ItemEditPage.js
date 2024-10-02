import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ItemSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Item name must be at least 3 characters long")
    .required("Item name is required"),
  group: Yup.string().required("Group is required"),
  form: Yup.string().required("Form is required"),
  department: Yup.string().required("Department is required"),
});

const EditItemPage = () => {
  const { id } = useParams();
  const [item, setItem] = React.useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/items/${id}`)
      .then((response) => setItem(response.data))
      .catch((error) => console.error("Error fetching item:", error));
  }, [id]);

  const handleSubmit = (values) => {
    axios
      .put(`/api/items/${id}`, values)
      .then((response) => {
        console.log("Item updated:", response.data);
      })
      .catch((error) => {
        console.error("Error updating item:", error);
      });
  };

  const handleDelete = () => {
    fetch(`/api/items/${id}`, {
      method: "DELETE",
    })
      .catch((err) => console.error("Error deleting item:", err))
      .then(() => navigate("/items"));
  };

  if (!item) return <div>Loading...</div>;

  return (
    <div>
      <h2>Edit Item</h2>
      <button onClick={handleDelete}>Delete</button>

      <Formik
        initialValues={{
          name: item.name,
          image_url: item.image_url,
          group: item.group,
          form: item.form,
          department: item.department,
          size: item.size,
          category: item.category,
          count: item.count,
        }}
        validationSchema={ItemSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form>
            <div>
              <label htmlFor="name">Item Name</label>
              <Field name="name" type="text" />
              <ErrorMessage name="name" component="div" />
            </div>
            <div>
              <label htmlFor="image_url">Image URL</label>
              <Field name="image_url" type="text" />
              <ErrorMessage name="image_url" component="div" />
            </div>
            <div>
              <label htmlFor="count">Count</label>
              <Field name="count" type="number" />
              <ErrorMessage name="count" component="div" />
            </div>
            <div>
              <label htmlFor="category">Category</label>
              <Field as="select" name="category">
                <option value="">Select a category</option>
                <option value="Dairy">Dairy</option>
                <option value="Fruits/Vege.">Fruits/Vege.</option>
                <option value="Grains">Grains</option>
                <option value="Proteins">Proteins</option>
                <option value="Others">Others</option>
              </Field>
              <ErrorMessage name="category" component="div" />
            </div>

            <div>
              <label htmlFor="group">Group</label>
              <Field as="select" name="group">
                <option value="">Select a group</option>
                <option value="Dairy">Produce</option>
                <option value="Fruits/Vege.">Dried Fruit</option>
                <option value="Grains">Eggs</option>
                <option value="Proteins">Seafood</option>
                <option value="Others">Sweeteners</option>
                <option value="Others">Frozen</option>
                <option value="Others">Cheese</option>
                <option value="Others">Beverages</option>
                <option value="Others">Dry Goods</option>
                <option value="Others">Juices</option>
                <option value="Others">Bread</option>
                <option value="Others">Granola Bars</option>
                <option value="Others">Coffee</option>
                <option value="Others">Candy</option>
                <option value="Others">Meat</option>
                <option value="Others">Dairy</option>
              </Field>
              <ErrorMessage name="group" component="div" />
            </div>
            <div>
              <label htmlFor="form">Form</label>
              <Field as="select" name="form">
                <option value="">Select a form</option>
                <option value="bottle">Bottle</option>
                <option value="tub">Tub</option>
                <option value="sliced">Sliced</option>
                <option value="block">Block</option>
                <option value="carton">Carton</option>
                <option value="fresh">Fresh</option>
                <option value="frozen">Frozen</option>
                <option value="package">Package</option>
                <option value="bag">Bag</option>
                <option value="loaf">Loaf</option>
              </Field>
              <ErrorMessage name="form" component="div" />
            </div>
            <div>
              <label htmlFor="department">Department</label>
              <Field as="select" name="department">
                <option value="">Select a department</option>
                <option value="beverages">Beverages</option>
                <option value="dairy">Dairy</option>
                <option value="produce">Produce</option>
                <option value="baked goods">Baked Goods</option>
                <option value="snacks">Snacks</option>
                <option value="dry goods">Dry Goods</option>
                <option value="canned goods">Canned Goods</option>
                <option value="frozen goods">Frozen Goods</option>
                <option value="pantry">Pantry</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="meat">Meat</option>
              </Field>
              <ErrorMessage name="department" component="div" />
            </div>
            <div>
              <label htmlFor="size">Size</label>
              <Field name="size" type="text" />
            </div>
            <button type="submit">Update Item</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditItemPage;
