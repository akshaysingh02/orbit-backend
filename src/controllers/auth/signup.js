

const singupController = async (req,res) =>{
    try {
        res.json({message:"controller ran"})
    } catch (error) {
        console.log(error)
    }
}

export {
    singupController
}