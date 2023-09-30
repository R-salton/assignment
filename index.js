import express from 'express';
import axios from 'axios';
import _ from 'lodash';


const port = 3000;

const curlOptions = {
    method: 'GET',
    url: 'https://intent-kit-16.hasura.app/api/rest/blogs',
    headers: {
      'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
    }
}




const app = express();



// ==================| Middleware to fetch blog data |======================
app.get('/api/blog-stats', async (req, res) => {
    try {
      // Define the curl request options
      
      
  
      // Make the HTTP request to fetch the blog data
      const response = await axios(curlOptions);

        // Extract the blog data from the response
    const blogs = response.data.blogs;
    
    // Perform analytics using Lodash

    const totalBlogs = blogs.length;
    const longestTitleBlog = _.maxBy(blogs, (blog)=> blog.title.length);
    const privacyBlogs = _.filter(blogs, (blog) =>
      _.includes(_.toLower(blog.title), 'privacy')
    );
    const uniqueTitles = _.uniqBy(blogs, 'title');

    //  Prepare analytics results
     const analyticsResults = {
        totalBlogs: totalBlogs,
        longestTitleBlog:longestTitleBlog,
        numPrivacyBlogs: privacyBlogs.length,
        uniqueTitles,
      };
      //Provide Analyzed Result

        res.json(analyticsResults);
       
    } catch (error) {

      console.error('Error fetching blog data:', error);
      res.status(500).json({ error: 'An error occurred while fetching blog data.' });
    }
  });



  //==============| Search endpoint to filter blogs based on the query parameter |========================
app.get('/api/blog-search', async (req, res) => {
    try {
      const query = req.query.query; // Get the query parameter from the URL
  
      if (!query) {
        return res.status(400).json({ error: 'Query parameter is missing.' });
      }
  
      // Make the HTTP request to fetch the blog data
      const response = await axios(curlOptions);
  
      // Convert the JSON response data to a JavaScript object
      const blogs = response.data.blogs;
  
      // Filter blogs based on the query string (case-insensitive)
      const matchingBlogs = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(query.toLowerCase())
      );
  
      // Respond with the matching blogs
      res.json(matchingBlogs);
    } catch (error) {
      console.error('Error searching for blogs:', error);
      res.status(500).json({ error: 'An error occurred while searching for blogs.' });
    }
  });

app.listen(port,()=>{
    console.log(`App is running on port ${port}`)
}
)