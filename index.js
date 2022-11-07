const Joi = require("joi");
const express = require("express");
const app = express();
app.use(express.json()); //enable this so the response will be parsed correctly???

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

//callback(request, response)
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

//:id is a parameter
app.get("/api/courses/:id", (req, res) => {
  //parseInt because id here is already a string, so convert it to int
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  const result = validateCourse(req.body);
  if (!course)
    res.status(404).send(`The course with ID ${req.params.id} was not found`);
  res.send(course);
});

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  //parseInt because id here is already a string, so convert it to int
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res
      .status(404)
      .send(`The course with ID ${req.params.id} was not found`);
  }

  //destructuring to directly reference the error object
  const { error } = validateCourse(req.body);
  if (error) {
    //return here to stop, don't execute remaining code in this put block
    return res.status(400).send(error.details[0].message);
  }

  course.name = req.body.name;
  res.send(course);
});

app.get("/api/posts/:year/:month", (req, res) => {
  //   res.send(req.params); //route parameters
  res.send(req.query); //query parameters are optional data after the route parameters
});

app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res
      .status(404)
      .send(`The course with ID ${req.params.id} was not found`);
  }

  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

const port = process.env.PORT || 3000; // if PORT is set use env.PORT otherwise use 3000
app.listen(port, () => console.log(`Listening on port ${port}`));

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(course);
}
