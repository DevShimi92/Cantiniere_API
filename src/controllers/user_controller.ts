import { Request, Response } from "express";
import { log } from "../config/log_config";
import { User } from "../models/user";

export class UserController {

  public async createUser(req: Request, res: Response) : Promise<void> {
    log.info("Create User");

    if (req.body.last_name == null || req.body.first_name == null || req.body.password == null || req.body.email == null )
      {
            res.status(400).json({ error : 'Missing Fields' });
            res.end();
            log.error("Create User : Fail - Missing Fields");      
      }
    else
      {
        const emailFound = await User.findAll<User>({
              attributes : ['email'],
              raw: true,
              where: {
                email: req.body.email
              }
            }).then(function(data) { 
              return data;
            });
          
        if (emailFound.length > 0)
            {
              res.status(409);
              res.end();
              log.error("Create User : Fail - Account already exist");      
            }
        else
            {
              await User.create<User>({ 
                  last_name: req.body.last_name,
                  first_name: req.body.first_name,
                  password: req.body.password,
                  email: req.body.email, })
                .then(() => {
                  res.status(201).end();
                  log.info("Create User : OK");
                }).catch((err: Error) => {
                  res.status(500).end();
                  log.error("Create User : Fail - ERROR");
                  log.error(err);
                });

            }

      }
    
  }
  
  public async getAllUser(req: Request,res: Response) : Promise<void> {
    log.info("Get all User");

    await User.findAll<User>({
      attributes : ['id','first_name','last_name','money'],
      raw: true,
    }).then(function(data) { 

      if(data.length == 0)
        {
          res.status(204).end();
        }
      else
        {
          res.status(200).json(data).end();
        }

      log.info("Get all User : OK");
    
    });

  }

  public async updateUser(req: Request, res: Response) : Promise<void> {
    log.info("Update User");

    if ( req.body.id == null )
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Update User : Fail - Missing Fields");      
      }
    else if (isNaN(req.body.id))
      {
            res.status(400).json({ error : "Number only" });
            res.end();
            log.error("Update User : Fail - The value is not number"); 
      }
    else
    {
      const idSearch = await User.findAll<User>({
        attributes : ['id'],
        raw: true,
        where: {
          id: req.body.id
        }
          }).then(function(data) { 
        return data;
      });

      if (idSearch.length == 0)
        {
          res.status(404).json({ error : 'Account not exist' });
          res.end();
          log.error("Update User : Fail - Account not exist");      
        }
      else
        {
          let OK = 0;
          let Error = 0;

          if(req.body.first_name != null)
          {
            await User.update({ first_name: req.body.first_name }, {
              where: {
                id: req.body.id
              }
            }).then(() => OK++)
            .catch((err: Error,) => {
              Error++;
              log.error('Error with field first_name of user : ' + err);
                });
            }

          if(req.body.last_name != null)
          {
            await User.update({ last_name: req.body.last_name }, {
              where: {
                id: req.body.id
              }
            }).then(() => OK++)
            .catch((err: Error,) => {
              Error++;
              log.error('Error with field last_name of user : ' + err);
                });
          }

          if(req.body.email != null)
          {
            await User.update({ email: req.body.email }, {
              where: {
                id: req.body.id
              }
            }).then(() => OK++)
            .catch((err: Error,) => {
              Error++;
              log.error('Error with field email of user : ' + err);
                });
          }

          if(req.body.password != null)
          {
            await User.update({ password: req.body.password }, {
              where: {
                id: req.body.id
              }
            }).then(() => OK++)
            .catch((err: Error,) => {
              Error++;
              log.error('Error with field password of user : ' + err);
                });
          }

          if(Error == 0)
            {
              res.status(204).end();
              log.info("Update User : OK");
            }
          else
            {
              res.status(409).end();
              log.warn("Update User : OK with error - "+OK+' update done only');
            }

        }

    }

  }

  public async deleteUser(req: Request,res: Response) : Promise<void> {
    log.info("Delete User");

    if ( req.body.id == null )
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Delete User : Fail - Missing Fields");      
      }
    else if (isNaN(req.body.id))
      {
            res.status(400).json({ error : "Number only" });
            res.end();
            log.error("Delete User : Fail - The value is not number"); 
      }
    else
      {
        await User.destroy<User>({
          where: {
            id: req.body.id
          }
        }).then(function(dataUser) {  // dataUser beacause sonarcloud logic
          if(dataUser == 0)
            {
              res.status(404).end();
              log.info("Delete User : Fail - Not found");
            }
          else
          {
              res.status(204).end();
              log.info("Delete User : OK");
          }
            
        }).catch((err: Error) => {
          res.status(500).end();
          log.error("Delete User : Fail - ERROR");
          log.error(err);
        });
      }
  }

}