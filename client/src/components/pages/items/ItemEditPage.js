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
  category: Yup.string().required("Category is required"),
  count: Yup.number().required("Count is required").min(0, "Count must be at least 0"),
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
        navigate(`/items/${id}`);
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

  // Define your static options
  const categoryOptions = [
    "Dairy",
    "Fruits/Vege.",
    "Grains",
    "Proteins",
    "Others",
  ];

  const groupOptions = [
    "Produce",
    "Dried Fruit",
    "Eggs",
    "Seafood",
    "Sweeteners",
    "Frozen",
    "Cheese",
    "Beverages",
    "Dry Goods",
    "Juices",
    "Bread",
    "Granola Bars",
    "Coffee",
    "Candy",
    "Meat",
    "Dairy",
  ];

  const formOptions = [
    "bottle",
    "tub",
    "sliced",
    "block",
    "carton",
    "fresh",
    "frozen",
    "package",
    "bag",
    "loaf",
  ];

  const departmentOptions = [
    "beverages",
    "dairy",
    "produce",
    "baked goods",
    "snacks",
    "dry goods",
    "canned goods",
    "frozen goods",
    "pantry",
    "pharmacy",
    "meat",
  ];

  return (
    <div>
      <h2>Edit Item</h2>
      <button onClick={handleDelete}>Delete</button>

      <Formik
        initialValues={{
          name: item.name,
          image_url: item.image_url || '',
          group: item.group,
          form: item.form,
          department: item.department,
          size: item.size || '',
          category: item.category,
          count: item.count,
        }}
        validationSchema={ItemSchema}
        onSubmit={handleSubmit}
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
                <option value={item.category}>{item.category}</option>
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="category" component="div" />
            </div>
         <div>
              <label htmlFor="group">Group</label>
              <Field as="select" name="group">
                <option value={item.group}>{item.group}</option>
                {groupOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="group" component="div" />
            </div>

            <div>
              <label htmlFor="form">Form</label>
              <Field as="select" name="form">
                <option value={item.form}>{item.form}</option>
                {formOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="form" component="div" />
            </div>

            <div>
              <label htmlFor="department">Department</label>
              <Field as="select" name="department">
                <option value={item.department}>{item.department}</option>
                {departmentOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
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
