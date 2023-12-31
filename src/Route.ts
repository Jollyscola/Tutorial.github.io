import { Tour } from "./pages/Home/tour";
import { RouteMap } from "./RouteInterface";
import {Quiz} from './pages/Quiz/Quizquuestion';
import { videoslider } from './pages/Home/video';
import { Markdown  } from './pages/Home/markdown';
import { TextHelp } from './pages/Texthelp/texthelp';


let items = [
  {
    title: 'Denmark',
    text: 'Denmark, a Scandinavian gem, is known for its picturesque landscapes and progressive society.',
    subItems: ['Copenhagen', 'Odense'],
    isOpen: false,
  },
  {
     title: 'Sweden',
     text: 'Sweden, often referred to as Sverige in Swedish, is a captivating Nordic nation known for its stunning natural landscapes and progressive values.',
     subItems: ['Gothenburg', 'Stockholm'],
     isOpen: false,
   },
  // Add more items as needed
];


export class Route implements EventListenerObject 
{

  public quiz: Quiz  = null;
  public tour: Tour = null;
  public markdown:Markdown = null;
  public texhhelp: TextHelp = null;
  public gallery: videoslider  = null;
  public contentDiv: HTMLElement  = null;
  private readonly routes: RouteMap = null;
  private navLinks: NodeListOf<Element> = null;

  constructor() 
  {
    this.contentDiv = document.querySelector('#main-page') as HTMLElement;
    this.navLinks = document.querySelectorAll('a[data-route]') as NodeListOf<Element>;

    this.routes = 
    {
      '/': 'src/pages/Home/home.html',
      '/quiz' : 'src/pages/Quiz/quiz.html',
      '/texthelp': 'src/pages/Texthelp/texthelp.html',
      '404': 'src/pages/404.html', 
    };

    this.navLinks.forEach((link) => 
    {
      link.addEventListener('click', this);
      link.addEventListener('keydown', this);
    });
  
    this.navigate(window.location.pathname);

  }

  handleEvent(event: Event) : void
  {
    if (event.type === 'click' || event.type === 'keydown') 
      this.handleLinkClick(event as MouseEvent | KeyboardEvent);
  }

  private handleLinkClick(event: Event) : void
  {
    event.preventDefault();
    let target = event.target as HTMLAnchorElement;
    if (target.tagName === 'A' && target.hasAttribute('data-route')) 
      this.navigate(target.getAttribute('data-route') || '/');
  }

  public async navigate(path: string): Promise<void>
  {
      let htmlPageURL = this.routes[path] || this.routes['404'];

      try
      {
        let response = await fetch(htmlPageURL);

        if (response.status === 404) 
            htmlPageURL = this.routes['404'];

        let html = await response.text();

        this.updateContent(html,path);
      }
      catch(error)
      {
        htmlPageURL = this.routes['404'];

        let response = await fetch(htmlPageURL);
        let html = await response.text();

        this.updateContent(html, path);
      }
  }

  private updateContent(html: string,path:string) : void
  {
    
    this.updateURL(path);

    if (this.contentDiv) 
    {
      this.contentDiv.innerHTML = html;

      if(path == "/")
      {
        this.tour = new Tour();
        this.markdown = new Markdown(this.contentDiv);
        this.gallery = new videoslider(this.contentDiv);
      } 
      else if (path == "/quiz")
        this.quiz = new Quiz(this.contentDiv);
      else if(path == "/texthelp")
        this.texhhelp = new TextHelp(this.contentDiv,items);
      else
      {
        this.tour = new Tour();
        this.markdown = new Markdown(this.contentDiv);
        this.gallery = new videoslider(this.contentDiv);
      }
    }
  }

  private updateURL(path: string) : void
  {
    window.history.pushState({}, '', path);
  }
}

