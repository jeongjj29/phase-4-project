import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const ItemSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Item name must be at least 3 characters long")
    .required("Item name is required"),
  group: Yup.string().required("Group is required"),
  form: Yup.string().required("Form is required"),
  department: Yup.string().required("Department is required"),
});

const CreateItemPage = () => {
  const navigate = useNavigate(); // Get the navigate function

  return (
    <div>
      <h2>Create a New Item</h2>
      <Formik
        initialValues={{
          name: "",
          image_url: "",
          group: "",
          form: "",
          department: "",
          size: "",
          category: "",
          count: "",
        }}
        validationSchema={ItemSchema}
        onSubmit={(values) => {
          fetch("/api/items", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((data) => {
              console.log("Item created:", data);
              navigate(`/items/${data.id}`); // Navigate to the newly created item page
            })
            .catch((error) => {
              console.error("There was an error creating the item!", error);
            });
        }}
      >
        {() => (
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
            <button type="submit">Create Item</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateItemPage;
