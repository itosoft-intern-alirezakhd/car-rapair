
export const index = async (req, model, queryData, aggregateData, sort) => {
  try {
    // const Model = require(`${config.path.model}/${model}`);
    let limit = 21;
    const count = await model.aggregate([
      ...queryData,
      { $group: { _id: null, count: { $sum: 1 } } },
      { $project: { _id: 0 } },
    ]);

    const totalDocs = count[0].count;
    if (totalDocs > 0) {
      if (req.query.all) { //age query parameter ke dadan boolean all true bashe yani hamahsho mikhan
        limit = totalDocs;
      } else if (req.query.limit) { // age query parameter ke dadan  limit true yani ba mahdoodirat mikhan
        if (req.query.limit <= totalDocs) { //check mahdoodiat tedad 
          limit = Number(req.query.limit); 
        } else {
          limit = totalDocs;
        }
      }
    }
    let data = [...queryData, { $sort: sort }];
    let totalPages = Math.ceil(totalDocs / limit); // taghsim kol tedad mohtava bar mahdoodiat  ta tedad safhe ha bedast biad
    let page = 1;     //default page = 1
    let pagingCounter = null;
    let hasPrevPage = false;
    let hasNextPage = false;
    let prevPage = null;
    let nextPage = null;
    if (req.query.page && req.query.page != 1) { //pagei ke mojood va be gheir az 1 bashe 
      page = Number(req.query.page); 
      data = [...data, { $skip: limit * (page - 1) }]; // age masaln page 4 ro mikhan bayad limit * (page -1 )
    }
    if (page > 1) { 
      hasPrevPage = true; //age ghabli dare
      prevPage = page - 1; //current page menhaye 1
    }
    if (totalPages > page) { //age current page az tedad kol page ha kamtar bashe 
      hasNextPage = true;
      nextPage = page + 1;   
    }
    data = [...data, { $limit: limit }, ...aggregateData];
    pagingCounter = (page - 1) * limit + 1;
    const result = await model.aggregate(data);
    const paginateItem = {
      totalDocs,
      totalPages,
      limit,
      page,
      pagingCounter,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    };
    return { docs: result, ...paginateItem };
  } catch (err) {
    console.log(err);
    return false;
  }
};


export default index