const  advancedresult=(model,populate)=>async (req,res,next)=>{

    let query;
         //copy req.query
         const reqQuery={...req.query};
         //field to  exclude
         const removeFields=['select','sort','page','limit']
         //loop overField and delete them from reQuery
         removeFields.forEach(param=>delete reqQuery[param])
         console.log(reqQuery)
         //creating query string
         let queryStr=JSON.stringify(reqQuery)
         //creating operator
         queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`)
         
         query= model.find(JSON.parse(queryStr));
         
           //selecting filed
         if(req.query.select){
            const fields=req.query.select.split(',').join(' ');
             query=query.select(fields)
         }

         if (req.query.sort) {
             const sortBy = req.query.sort.split(',').join(' ');
             query = query.sort(sortBy)
         }else{
             query=query.sort('-createdAt')
         }

         //pagination
         const page =parseInt(req.query.page,10) || 1;
         const limit =parseInt(req.query.limit,10) || 1;
         const endIndex =(page-1) * limit;
         const total=await model.countDocuments()
         query=query.skip(endIndex).limit(limit)

         if(populate){
             query=query.populate(populate)
         }


         const result=await query
         //pagination result
         const pagination={};
         if(endIndex<total){
             pagination.next={
                 page:page+1,
                 limit
             }
         }

         if(endIndex>0){
             pagination.pre={
                 page:page-1,
                 limit
             }
         }
         res.advancedresult={
             success:true,
             count:result.length,
             pagination,
             data:result
         }
       
         next()
}


module.exports=advancedresult