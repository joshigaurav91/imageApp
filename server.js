require('dotenv').config()
const express = require('express')
const app = express()
const multer = require('multer')
const upload = multer({ dest: 'images/' })
//app.use('/images', express.static('images'))
const fs = require('fs')
const database = require('./database')
const path = require('path')
app.use(express.static(path.join(__dirname, "build")))

app.get("/api/images", async (req, res) => {
    const images = await database.getImages()
    console.log(images)
    res.send({images})
})

app.post('/api/images', upload.single('image'), async (req, res) => {
    
    const imagePath = req.file.path
    const description = req.body.description

    // Save this data to a database probably
    const image = await database.addImage(imagePath, description)
    console.log(description, imagePath, req.file)
    res.send({image})
})

app.get('/images/:imageName', (req, res) => {
    // do a bunch of if statements to make sure the user is 
    // authorized to view this image, then
    const imageName = req.params.imageName
    const readStream = fs.createReadStream(`images/${imageName}`)
    readStream.pipe(res)
})

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`listening on port ${port}`))