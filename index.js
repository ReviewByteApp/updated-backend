const error = require("./middleware/error");
const mongoose = require("mongoose");
const express = require("express");
const AdminRouter = require("./routers/admin");
const AuthRouter = require("./routers/auth");

const PostRouter = require("./routers/post");
const categoryRouter = require("./routers/category");
const SubcategoryRouter = require("./routers/subcategory");
const ReviewRouter = require("./routers/review");
const CustomerRouter = require("./routers/customer");
const CustomerAuthRouter = require("./routers/customerAuth");
const AdminInfoRouter = require("./routers/adminInfo");
const CompanyIntroRouter = require("./routers/companyIntro");

const AdminContactRouter = require("./routers/adminContact");

const app = express();

app.use("/admin", AdminRouter);
app.use("/auth", AuthRouter);

app.use("/post", PostRouter);
app.use("/category", categoryRouter);
app.use("/subcategory", SubcategoryRouter);
app.use("/review", ReviewRouter);
app.use("/customer", CustomerRouter);
app.use("/customerAuth", CustomerAuthRouter);
app.use("/adminInfo", AdminInfoRouter);
app.use("/companyIntro", CompanyIntroRouter);

app.use("/adminContact", AdminContactRouter);

app.use(error);

mongoose
  .connect("mongodb://127.0.0.1:27017/review-app")
  .then(() => console.log("mongodb connected"))
  .catch((ex) => console.log(ex));

const port = 3001;
app.listen(port, () => console.log(`server listen to port ${port}`));
