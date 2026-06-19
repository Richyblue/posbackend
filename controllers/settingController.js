const Setting = require("../models/settings")

exports.getSettings = async (req,res) => {
  try {

    let settings =
      await Setting.findOne()

    if(!settings){
      settings =
        await Setting.create({})
    }

    return res.status(200).json({
      success:true,
      settings
    })

  } catch(error){

    return res.status(500).json({
      success:false,
      message:error.message
    })

  }
}

exports.updateSettings =
async (req,res)=>{

  try{

    let settings =
      await Setting.findOne()

    if(!settings){
      settings =
        await Setting.create({})
    }

    await settings.update(req.body)

    return res.status(200).json({
      success:true,
      message:"Settings updated",
      settings
    })

  }catch(error){

    return res.status(500).json({
      success:false,
      message:error.message
    })

  }

}