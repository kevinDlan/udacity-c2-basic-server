import express, { Router, Request, Response } from 'express';

import { Car, cars as cars_list } from './cars';

(async () => {
  let cars:Car[]  = cars_list;

  //Create an express application
  const app = express(); 

  // allow user to handle user input 
  app.use(express.json());
  app.use(express.urlencoded());


  //default port to listen
  const port = 8082; 
   

  // Root URI call
  app.get( "/", ( req: Request, res: Response ) => {
    res.status(200).send("Welcome to the Cloud!");
  } );


  // app.post("/store/user",(req:Request, res:Response)=>{
  //     const { fname, lname, email } = req.body;
  //     console.log({ fname, lname, email });
  //     res.send('All right');
  // });

  // Get a greeting to a specific person 
  app.get( "/persons/:name", 
    ( req: Request, res: Response ) => {
      let { name } = req.params;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get( "/persons/", ( req: Request, res: Response ) => {
    let name  = req.query.name;

    if ( !name ) {
      return res.status(400)
                .send(`name is required`);
    }

    return res.status(200)
              .send(`Welcome to the Cloud, ${name}!`);
  } );

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as 
  // an application/json body to {{host}}/persons
  app.post( "/persons", 
    async ( req: Request, res: Response ) => {

      const { name } = req.body;

      if ( !name ) {
        return res.status(400)
                  .send(`name is required`);
      }

      return res.status(200)
                .send(`Welcome to the Cloud, ${name}!`);
  } );

  // @TODO Add an endpoint to GET a list of cars
  // it should be filterable by make with a query paramater
  app.get("/cars", (req:Request, res:Response)=>
  {
    let make = req.query.make;
    let carsList = cars;
    if(make)
    {
      carsList = cars.filter((car) => car.make === make)
    }
    res.status(200).send(carsList);
  });

  // @TODO Add an endpoint to get a specific car
  // it should require id
  // it should fail gracefully if no matching car is found
  app.get("/cars/:id", (req:Request, res:Response)=>
  {
    const id: number = Number.parseInt(req.params.id);
    if(!id)
    {
      return res.status(400).send('id is required');
    }

    const findCar = cars.filter(car => car.id === id);
    if(findCar && findCar.length === 0)
    {
      return res.status(404).send("Car is not find");
    }

    res.send(findCar);
  });

  /// @TODO Add an endpoint to post a new car to our list
  // it should require id, type, model, and cost

  app.post("/cars", (req:Request, res:Response)=>{

    try{
    const {id,cost,model,type,make} = req.body;
    
    if(!id || !cost || !model || !type || !make)
    {
      return res.status(403).send("Please fill all field");
    }
    const car: Car = {
      make: make,
      type: type,
      model: model,
      cost: cost,
      id: id,
    };
    // const newCars = [...cars,car];
    cars.push(car);
    res.status(201).send(car);
    }catch(e)
    {
      res.status(500).json({error: "Something rong, Please Try later."})
    }
  });


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
