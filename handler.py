
from BeautifulSoup import BeautifulSoup
from google.appengine.api import urlfetch





# Import settings.
from utils import *

# Log a message each time this module get loaded.
logging.info('Loading %s', __name__)


# Import datastore models.
from model import *


class Knol(webapp.RequestHandler):
  # Render a Knol from a remote page. 

  def get(self):
  
    if self.request.get('ksnol_string'):
        knol_string = self.request.get('knol_string')
    else:
        knol_string = 'ilya-yakubovich/icewm/'
    
    url = "http://knol.google.com/k/" + knol_string
    page = urlfetch.fetch(url)
    soup = BeautifulSoup(page.content)
    print page.context 
    #print soup.prettify()

    logging.debug('Knol')
    
    
    
    
    
    
    
    
    knol_html = knol_string
    




    template_values = {
      'knol_html': knol_html,

                                                    
      }
     
      
    path = tpl_path('knol.html')
    self.response.out.write(template.render(path, template_values))

    
        

class Main(webapp.RequestHandler):
  # Splash Page Entity.
  def get(self):
    logging.debug('Viewing Splash Page')
    template_values = {}
    path = tpl_path('home.html')
    self.response.out.write(template.render(path, template_values))

# #######################
# RPC CALLS
# #######################
    
class RPCHandler(webapp.RequestHandler):
  #Arg1 is language. Arg2 is real_language
  """ Allows the functions defined in the RPCMethods class to be RPCed."""
  def __init__(self):
    webapp.RequestHandler.__init__(self)
    self.methods = RPCMethods()
 
  def get(self):
    func = None
   
    action = self.request.get('action')
    if action:
      if action[0] == '_':
        self.error(403) # access denied
        return
      else:
        func = getattr(self.methods, action, None)
   
    if not func:
      self.error(404) # file not found
      return
     
    args = ()
    while True:
      key = 'arg%d' % len(args)
      val = self.request.get(key)
      if val:
        args += (simplejson.loads(val),)
      else:
        break
    result = func(*args)
    self.response.out.write(simplejson.dumps(result))


class RPCMethods(webapp.RequestHandler):
  """ Defines the methods that can be RPCed.
  NOTE: Do not allow remote callers access to private/protected "_*" methods.
  """

  def Add(self, *args):

    if users.get_current_user():
      logging.debug('Posting Programming Grade')    
      grade = ProgGrade()
      grade.picked_language = args[0]
      grade.real_language = args[1]

      grade.author = users.get_current_user()
      LOGINSTATUS = users.get_current_user()

      if grade.picked_language == grade.real_language:
         grade.score = "correct"
      else:
         grade.score = "incorrect"
      
      try:
        grade.put()
        logging.info('ProgGrade entered by user %s with score %s, real: %s, picked: %s'
                     % (users.get_current_user(), grade.score, grade.real_language, grade.picked_language))
      except:
        raise_error('Error saving grade for user %s with score %s, real: %s, picked: %s'
                      % (users.get_current_user(), grade.score, grade.real_language, grade.picked_language))







      return grade.score

    else:
      return 'not_logged'
      logging.error('User Not Logged In')
      
    
# #######################
# TAKE QUIZ
# #######################



   
class ProgQuiz(webapp.RequestHandler):
  # Taught Or Not Quiz Model.
  def get_language_set(self, languages_count, real_language, all_languages):

    language_set = []
    all_languages.remove(real_language)
    other_languages = random.sample(all_languages,
                              languages_count)
    
    for language in other_languages:
      language_set.append(language)
    
    language_set.append(real_language)
    random.shuffle(language_set)
    return language_set

  def get(self):
    logging.debug('Viewing Prog Quiz')
    global LOGINSTATUS
    if users.get_current_user() == None:
        self.redirect(login_url(self.request.uri))

    language_sets = []
    # BASIC and Logo could be used as fake items, but aren't properly seeded.
    
    all_languages = ['C', 'Fortran', 'Self',  'Haskell', 'Ruby', 'Forth',
                     'Python', 'Eiffel', 'JavaScript', 'Scheme',
                     'Pascal', 'Smalltalk', 'Perl', 'Objective-C', 'Java', 'Lisp', 'PHP', ]
    
    languages_count = 5
    

    

    real_languages = random.sample(all_languages,
                              languages_count)

    for real_language in real_languages:
      language_set = [real_language, self.get_language_set(languages_count, real_language, all_languages)]

      language_sets += [language_set]
    
    languages = random.sample(all_languages,  5)
    random.shuffle(languages)




    template_values = {
      'url': login_url(self.request.uri),
      'login_status' : LOGINSTATUS,
      'url_linktext': login_text(),
      'influence': random.choice(['influenced', 'influenced_by']),
      'languages': languages,
      'languages_count': languages_count,
      'language_sets': language_sets,
                                                    
      }
     
      
    path = tpl_path('programming_quiz.html')
    self.response.out.write(template.render(path, template_values))


# #######################
# VIEW SCORES
# #######################

  
    
  
class ProgViewScore(webapp.RequestHandler):
  # View Taught Or Not Grade.
   def get(self):
    logging.debug('Loading Programming Score')
    template_values = {
      'url': login_url("/"),
      'url_linktext': login_text(),
      }

    if users.get_current_user():
    
      try:
        latest_grades = ProgGrade.gql("WHERE author = :author ORDER BY date DESC LIMIT 5",
                                 author=users.get_current_user())   
        logging.info('Loading all Programming Grade items user %s'
                     % users.get_current_user().nickname()) 
      except:
        raise_error('Error Retrieving Data From ProgGrade Model: %s'
                      % users.get_current_user())
      
      try:
        correct_item = ProgGrade.gql("WHERE score = :1 AND author = :2",
                               "correct", users.get_current_user() )
        logging.info('Loading correct ProgGrade items user %s'
                     % users.get_current_user().nickname())
      except:
        raise_error('Error Retrieving Data From ProgGrade Model: %s'
                      % users.get_current_user())    
            
      totalscore = correct_item.count()
      totalitems = latest_grades.count()
      percentage = 0
      if totalitems > 0:
        percentage = float(totalscore) / float(totalitems) * 100
        percentage = int(percentage)
        
      template_values["grades"] = latest_grades
      template_values["totalscore"] = totalscore
      template_values["totalitems"] = totalitems
      template_values["percentage"] = percentage

                        
      try:
        highscore = 0
        highscore = HighScore.gql("WHERE author = :author ORDER BY highscore DESC LIMIT 1",
                                 author=users.get_current_user())   
        logging.info('Loading High-Score from user %s: %s'
                     % (users.get_current_user().nickname(), highscore))

        template_values["highscore"] = highscore
        
      except:
        raise_error('Error Retrieving High Score From ProgGrade Model: %s'
                      % users.get_current_user())   

      
    path = tpl_path('prog_score.html')
    self.response.out.write(template.render(path, template_values))
  



# #######################
# HIGH SCORE
# #######################    

class NewHighScore(webapp.RequestHandler):
  #Post high score. 

  def get(self):
    logging.debug('Posting High Score')

     
    global LOGINSTATUS

    if users.get_current_user():
        
      newscore = HighScore()
      newscore.highscore = int(self.request.get('highscore'))
      newscore.author = users.get_current_user()


      try:
        newscore.put()
        logging.info('HighScore entered by user %s with score %s'
                     % (users.get_current_user(), newscore.highscore))
      except:
        raise_error('Error saving grade for user %s with score %s'
                      % (users.get_current_user(), newscore.highscore))

    else:
      logging.info('User Not Logged In')
     
    self.redirect('/score/')   

    

