import Router  from 'express'
import Item from '../models/item.js'
import  find from '../models/item.js'
import findOneAndDelete  from '../models/item.js'
import findOne from '../models/item.js'
import Auth from '../middleware/auth.js'

const router = new Router()

//fetch all items
router.get('/items', Auth, async(req, res) => {
  
    if(req.query.user == 1) {
        try {
           const items = await find({ owner: req.user._id})
            res.status(200).send(items)
        } catch (error) {
            console.log(error)
            res.status(500).send('something went wrong')
        }
    } else {
    try {
        const items = await find({})
        res.status(200).send(items)
    } catch (error) {
        res.status(400).send(error)
    }
}
})

//fetch an item
router.get('/items/:id', Auth, async(req, res) => {
    try{
        const item = await findOne({_id: req.params.id})
        if(!item) {
            res.status(404).send({error: "Item not found"})
        }
        res.status(200).send(item) 
    } catch (error) {
        res.status(400).send(error)
    }
})

//create an item
router.post('/items',Auth, async(req, res) => {
    try {
        const newItem = new Item({
            ...req.body,
            owner: req.user._id
        })
        await newItem.save()
        res.status(201).send(newItem)
    } catch (error) {
        console.log({error})
        res.status(400).send({message: "error"})
    }
})

//update an item

router.patch('/items/:id', Auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'description', 'category', 'price']

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({ error: 'invalid updates'})
    }

    try {
        const item = await findOne({ _id: req.params.id})
    
        if(!item){
            return res.status(404).send()
        }

        updates.forEach((update) => item[update] = req.body[update])
        await item.save()
        res.send(item)
    } catch (error) {
        res.status(400).send(error)
    }
})

//delete item
router.delete('/items/:id', Auth, async(req, res) => {
    try {
        const deletedItem = await findOneAndDelete( {_id: req.params.id} )
        if(!deletedItem) {
            res.status(404).send({error: "Item not found"})
        }
        res.send(deletedItem)
    } catch (error) {
        res.status(400).send(error)
    }
})


export default router