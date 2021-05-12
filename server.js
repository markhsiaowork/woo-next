const next = require("next");
const express = require("express");
const wooConfig = require("./wooConfig");
const bodyParser = require("body-parser");

const server = express();
server.use(bodyParser.urlencoded({ extended: true }));

const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const WooCommerce = new WooCommerceRestApi({
  url: wooConfig.siteUrl,
  consumerKey: wooConfig.consumerKey,
  consumerSecret: wooConfig.consumerSecret,
  version: "wc/v3",
  queryStringAuth: true,
});

const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();
    // Get product list
    server.get("/getProducts", (req, res) => {
      // List products
      WooCommerce.get("products", {
        per_page: 20, // 20 products per page
      })
        .then((response) => {
          // Successful request
          // console.log("Response Status:", response.status);
          // console.log("Response Headers:", response.headers);
          // console.log("Response Data:", response.data);
          // console.log("Total of pages:", response.headers["x-wp-totalpages"]);
          // console.log("Total of items:", response.headers["x-wp-total"]);
          res.json(response.data);
        })
        .catch((error) => {
          // Invalid request, for 4xx and 5xx statuses
          console.log("Response Status:", error.response.status);
          console.log("Response Headers:", error.response.headers);
          console.log("Response Data:", error.response.data);
        })
        .finally(() => {
          // Always executed.
        });
      // WooCommerce.get("products", function (err, data, res) {
      //   response.json(JSON.parse(res));
      //   console.log(res);
      // });
    });

    // Add demo product
    server.post("/addProducts", (req, res) => {
      const data = {
        name: "M3",
        slug: "m3",
        permalink: "https://www.teproductlister.com/product/m1/",
        date_created: "2021-04-17T07:11:31",
        date_created_gmt: "2021-04-17T07:11:31",
        date_modified: "2021-05-10T05:00:34",
        date_modified_gmt: "2021-05-10T05:00:34",
        type: "simple",
        status: "publish",
        featured: false,
        catalog_visibility: "visible",
        description: "<p>2022</p>\n",
        short_description: "",
        sku: "",
        price: "222",
        regular_price: "222",
        sale_price: "333",
      };
      //POST
      WooCommerce.post("products", data)
        .then((response) => {
          res.json(response.data);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });
    server.post("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(port, (err) => {
      if (err) {
        throw err;
      }
      console.log(`Ready on ${port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
