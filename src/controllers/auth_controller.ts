import { Request, Response } from "express";
import { log } from "../config/log_config";
import { User } from "../models/user";
import { RefreshToken } from "../models/refresh_token";
import jwt from "jsonwebtoken";

function randomString(length:number, chars:string) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export class AuthController {
  
  public async login(req: Request, res: Response) : Promise<void> {
    log.info("Connection attempt to api");

    if (req.body.email == null || req.body.password == null)
      {
            res.status(400).json({ error : 'Missing Fields' }).end();
            log.error("Connection to api : Fail - Missing Fields");
      }
    else
      {

        await User.findOne<User>({
          attributes : ['id','last_name','first_name','email','money','password','cooker'],
          raw: true,
          where: {
            email: req.body.email
          }
        }).then(async function(data) { 
      
          if(data == null)
            {
              log.error("Connection to api : Fail - Account not found");
              res.status(401).end();
            }
          else
            {
              if( req.body.password == data.password)
              {

                let dataUser = { 
                  id : data.id, 
                  last_name : data.last_name,
                  first_name: data.first_name,
                  email: data.email,
                  money: data.money,
                  cooker: data.cooker
                };
               
                let token = jwt.sign(dataUser,process.env.SECRET_KEY,{ expiresIn: 15 });
         
                let refresh_token = jwt.sign({key_random : randomString(40, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')},process.env.SECRET_KEY_REFRESH);
                
                await RefreshToken.findOne({ where: { id_client: dataUser.id } }).then(async (data) => {
                 
                  if(data != null)
                  {
                    await RefreshToken.destroy({
                      where: {
                        id_client: dataUser.id,
                        tokenRefresh: data.tokenRefresh
                        }
                    });
                  }
                  
                  await RefreshToken.create<RefreshToken>({id_client: dataUser.id, tokenRefresh: refresh_token }).then(() => {
               
                    // res.setHeader('Set-Cookie', cookie.serialize('refresh_token', refresh_token, { httpOnly: true }))
                     res.status(200).json({
                       token: token,
                       refresh_token: refresh_token
                       }).end();
   
                     log.info("API connection successful for : " + dataUser.last_name);
   
                     }).catch((err: Error) => {
                       res.status(500).end();
                       log.error("Connection to api : Fail - ERROR");
                       log.error(err);
                     });


                });
                
              }
              else
                {
                  log.error("Connection to api : Fail - Failed identification");
                  res.status(401).end();
                }
            }
    
        
        });

      }

  }
  
  public loginTest(req: Request, res: Response) : void {
    console.log("HELL YUEAH");
    res.status(200).json({
      hell: 'yeah'
   }).end();
  }


  public async refreshToken(req: Request, res: Response) : Promise<void> {
    log.info("Refresh token request ...");

    if (req.body.refreshToken == null || req.body.id == null )
      {
            res.status(400).json({ error : 'Missing Fields' }).end();
            log.error("Refresh token : Fail - Missing Fields");
      }
    else
      {
        await RefreshToken.findAll<RefreshToken>({
          where: {
          id_client: req.body.id,
          tokenRefresh: req.body.refreshToken
          },
        }).then(async function(data) {
          
          if(data.length == 0)
            {
              res.status(403).end();
              log.error("Refresh token : Fail - NOT FOUND");
            }
          else
            {
              let refresh_token = jwt.sign({key_random : randomString(40, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')},process.env.SECRET_KEY_REFRESH);

              await RefreshToken.update<RefreshToken>({tokenRefresh: refresh_token}, {
                  where: {
                     id_client: req.body.id,
                  }}).then(async () => {

                    await User.findOne<User>({
                      attributes : ['id','last_name','first_name','email','money','password','cooker'],
                      raw: true,
                      where: {
                        id: req.body.id
                      }
                    }).then(function(data) { 
                      if(data != null)
                        {
                          let dataUser = { 
                            id : data.id, 
                            last_name : data.last_name,
                            first_name: data.first_name,
                            email: data.email,
                            money: data.money,
                            cooker: data.cooker
                          };

                          let token = jwt.sign(dataUser,process.env.SECRET_KEY, { expiresIn: 15  });

                          // res.setHeader('Set-Cookie', cookie.serialize('refresh_token', refresh_token, { httpOnly: true }))
                            res.status(200).json({
                              token : token,
                              refresh_token: refresh_token
                              }).end();
                              log.info("Refresh token successful for user n° " + req.body.id);
                        };

                    }).catch((err: Error) => {
                      res.status(500).end();
                      log.error("Refresh token : Fail - ERROR");
                      log.error(err);
                    });

               }).catch((err: Error) => {
                 res.status(500).end();
                 log.error("Refresh token : Fail - ERROR");
                 log.error(err);
               });

            }

        });
      }
  }

}