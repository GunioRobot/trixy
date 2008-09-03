
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0


""" Plopquiz Demo




"""





from views import *



    
    
def main():
  logging.getLogger().setLevel(logging.DEBUG)
  
  application = webapp.WSGIApplication(
                                       [
                                        ('/',
                                         PQDemo),
                                         ('/intro/?',
                                         PQIntro),
                                        ('/rpc/?',
                                         RPCHandler),                                                                                                                     
                                        ('/viewscore/?',
                                         ViewScore),  
                                        ('/quiz/?',
                                         QuizItem),                                         
                                        ],
                                       debug=True)
  wsgiref.handlers.CGIHandler().run(application)



if __name__ == "__main__":
  main()

