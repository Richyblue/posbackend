const {
  savePrintJob
} = require(
  '../service/printQueue'
);

exports.printReceipt =
async (req,res)=>{

  try{

    await printReceipt(
      req.body
    );

    return res.json({
      success:true,
      printed:true,
      message:
      'Receipt printed successfully'
    });

  }catch(error){

    console.error(error);

    await savePrintJob(
      req.body
    );

    return res.json({

      success:true,

      printed:false,

      queued:true,

      message:
      'Printer unavailable. Receipt queued.'

    });

  }

}