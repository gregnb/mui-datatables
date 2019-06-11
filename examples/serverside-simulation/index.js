import React from "react";
import ReactDOM from "react-dom";
import { CircularProgress } from '@material-ui/core';
import MUIDataTable from "../../src/";

class Example extends React.Component {

  state = {
    page: 0,
    count: 0,
    data: [["Loading Data..."]],
    isLoading: false
  };

  componentDidMount() {
    this.getData();
  }

  // get data
  getData = () => {
    this.setState({ isLoading: true });
    this.xhrRequest().then(({data, count}) => {
      this.setState({ data, isLoading: false, count });
    });
  }

  // mock async function
  xhrRequest = (tableState) => {
    var page = 0;
    var rowsPerPage = 10;
    if(tableState && 'page' in tableState) {
      page = tableState.page;
      rowsPerPage = tableState.rowsPerPage;
    }

    return new Promise((resolve, reject) => {
      let data = [
        {"name":"Tedra","profession":"Registered Nurse","city":"Cruzeiro"},
        {"name":"Liam","profession":"Dental Hygienist","city":"Penco"},
        {"name":"Mildrid","profession":"Recruiting Manager","city":"Gunungsubang"},
        {"name":"Hattie","profession":"Marketing Manager","city":"Yantal’"},
        {"name":"Concettina","profession":"Director of Sales","city":"Prinza"},
        {"name":"Paten","profession":"Executive Secretary","city":"Souto da Costa"},
        {"name":"Brien","profession":"Research Assistant III","city":"Capacho Nuevo"},
        {"name":"Dona","profession":"GIS Technical Architect","city":"Dollard-Des Ormeaux"},
        {"name":"Abbot","profession":"Associate Professor","city":"Shaykh al Ḩadīd"},
        {"name":"Ernestus","profession":"Business Systems Development Analyst","city":"Mirabel"},
        {"name":"Barry","profession":"Senior Quality Engineer","city":"Panayagan"},
        {"name":"Franklin","profession":"Senior Quality Engineer","city":"Huwan"},
        {"name":"Tabby","profession":"Accountant III","city":"Suodenniemi"},
        {"name":"Clemence","profession":"Senior Editor","city":"Guangshan Chengguanzhen"},
        {"name":"Yardley","profession":"Dental Hygienist","city":"Zhuhe"},
        {"name":"Early","profession":"Junior Executive","city":"Kikuchi"},
        {"name":"Somerset","profession":"Quality Engineer","city":"Palaiseau"},
        {"name":"Devland","profession":"Cost Accountant","city":"Kuanfeu"},
        {"name":"Jerry","profession":"Staff Scientist","city":"Golina"},
        {"name":"Alyce","profession":"Human Resources Manager","city":"Carahue"},
        {"name":"Oren","profession":"Data Coordiator","city":"Krajan Gajahmati"},
        {"name":"Martina","profession":"Tax Accountant","city":"Yudong"},
        {"name":"Lissy","profession":"Health Coach II","city":"Roi Et"},
        {"name":"Adam","profession":"Chemical Engineer","city":"Kalmar"},
        {"name":"Carma","profession":"Community Outreach Specialist","city":"Neftekamsk"},
        {"name":"Briano","profession":"Engineer III","city":"Powassan"},
        {"name":"Lorrie","profession":"Technical Writer","city":"Medvezh’yegorsk"},
        {"name":"Conant","profession":"Data Coordiator","city":"Carolina"},
        {"name":"Staford","profession":"Tax Accountant","city":"Jatiraya"},
        {"name":"Edna","profession":"Computer Systems Analyst III","city":"Horvati"},
        {"name":"Conny","profession":"Operator","city":"Gavea"},
        {"name":"Randolf","profession":"Recruiter","city":"Radišići"},
        {"name":"Etan","profession":"Librarian","city":"Huayucachi"},
        {"name":"Minda","profession":"Chief Design Engineer","city":"Insiza"},
        {"name":"Bell","profession":"Human Resources Manager","city":"Kiltamagh"},
        {"name":"Norman","profession":"Human Resources Assistant II","city":"Villa Consuelo"},
        {"name":"Wenona","profession":"Account Executive","city":"Västerås"},
        {"name":"Kalli","profession":"Automation Specialist IV","city":"Villeneuve-lès-Avignon"},
        {"name":"Charlotte","profession":"Account Coordinator","city":"Maumbawa"},
        {"name":"Annnora","profession":"VP Quality Control","city":"Sousa"},
        {"name":"Isador","profession":"Account Executive","city":"Pursat"},
        {"name":"Corinna","profession":"Information Systems Manager","city":"Sijiqing"},
        {"name":"Cilka","profession":"Environmental Specialist","city":"Pukou"},
        {"name":"Jilli","profession":"Senior Financial Analyst","city":"Pucallpa"},
        {"name":"Mauricio","profession":"Technical Writer","city":"Phu Sang"},
        {"name":"Prisca","profession":"Registered Nurse","city":"Uppsala"},
        {"name":"Agna","profession":"Software Test Engineer IV","city":"Seixal"},
        {"name":"Phillipe","profession":"Occupational Therapist","city":"Nsok"},
        {"name":"Peadar","profession":"Software Consultant","city":"Gangkou"},
        {"name":"Toby","profession":"Professor","city":"Jiquilillo"},
        {"name":"Rolando","profession":"Senior Financial Analyst","city":"Zhongxi"},
        {"name":"Raimundo","profession":"Structural Analysis Engineer","city":"Tarascon"},
        {"name":"Anastassia","profession":"Environmental Tech","city":"Jovim"},
        {"name":"Lennard","profession":"Programmer Analyst III","city":"Hässleholm"},
        {"name":"Flem","profession":"Information Systems Manager","city":"Zhaocun"},
        {"name":"Natty","profession":"Physical Therapy Assistant","city":"Kawage"},
        {"name":"Vina","profession":"Operator","city":"Saint Augustine"},
        {"name":"Carie","profession":"VP Quality Control","city":"Mohammedia"},
        {"name":"Eba","profession":"Analyst Programmer","city":"Qianpai"},
        {"name":"Fraze","profession":"Analog Circuit Design manager","city":"Čoka"},
        {"name":"Theda","profession":"Accountant I","city":"Sukošan"},
        {"name":"Julina","profession":"Senior Quality Engineer","city":"Hongjiaguan"},
        {"name":"Aigneis","profession":"Software Consultant","city":"Sanlanbahai"},
        {"name":"Saba","profession":"Account Executive","city":"San Jose"},
        {"name":"Gar","profession":"Business Systems Development Analyst","city":"Osorno"},
        {"name":"Farah","profession":"Recruiting Manager","city":"Whittlesea"},
        {"name":"Veronika","profession":"Research Associate","city":"Xinzhan"},
        {"name":"Maryellen","profession":"Civil Engineer","city":"Ise"},
        {"name":"Ilario","profession":"Help Desk Technician","city":"Yuquan"},
        {"name":"Lem","profession":"Senior Sales Associate","city":"Trilj"},
        {"name":"Abigale","profession":"Staff Scientist","city":"Najd al Jumā‘ī"},
        {"name":"Amberly","profession":"Help Desk Technician","city":"San Agustin"},
        {"name":"Farrah","profession":"Speech Pathologist","city":"Tabaga"},
        {"name":"Edgar","profession":"Legal Assistant","city":"Baitu"},
        {"name":"Norby","profession":"Senior Cost Accountant","city":"Frontignan"},
        {"name":"Ansell","profession":"Computer Systems Analyst I","city":"Kaset Sombun"},
        {"name":"Lilllie","profession":"Analog Circuit Design manager","city":"Petroúpolis"},
        {"name":"Rozanne","profession":"Editor","city":"Matnah"},
        {"name":"Hayyim","profession":"Financial Advisor","city":"Orsha"},
        {"name":"Vicky","profession":"GIS Technical Architect","city":"Baiyang"},
        {"name":"Gerri","profession":"Computer Systems Analyst III","city":"Cholet"},
        {"name":"Gaultiero","profession":"Design Engineer","city":"Soledad"},
        {"name":"Mordecai","profession":"Automation Specialist III","city":"Mikuni"},
        {"name":"Aguistin","profession":"Legal Assistant","city":"Banjar Dauhpangkung"},
        {"name":"Valentine","profession":"Social Worker","city":"Lazaro Cardenas"},
        {"name":"Joela","profession":"Civil Engineer","city":"Gaofeng"},
        {"name":"Ceciley","profession":"Web Designer II","city":"Qiping"},
        {"name":"Clarine","profession":"Human Resources Manager","city":"Magoúla"},
        {"name":"Lyn","profession":"Programmer Analyst I","city":"Baki"},
        {"name":"Erena","profession":"Teacher","city":"Idanha-a-Nova"},
        {"name":"Abba","profession":"Business Systems Development Analyst","city":"Esquel"},
        {"name":"Fredelia","profession":"Desktop Support Technician","city":"Clorinda"},
        {"name":"Pedro","profession":"Office Assistant III","city":"Manoc-Manoc"},
        {"name":"Michaela","profession":"Research Associate","city":"Przyborów"},
        {"name":"Natka","profession":"Assistant Manager","city":"Panacan"},
        {"name":"Christiana","profession":"Automation Specialist I","city":"Paris 17"},
        {"name":"Otes","profession":"Marketing Manager","city":"‘Aqrah"},
        {"name":"Katlin","profession":"Geological Engineer","city":"Pingsha"},
        {"name":"Lilly","profession":"Pharmacist","city":"Tours"},
        {"name":"Maximo","profession":"Administrative Officer","city":"Cañas"},
        {"name":"Dame","profession":"VP Sales","city":"Santa Bárbara"},
        {"name":"Alison","profession":"Executive Secretary","city":"Nanhe"},
        {"name":"Remus","profession":"Legal Assistant","city":"Sanlidian"},
        {"name":"Inigo","profession":"Nurse","city":"Brody"},
        {"name":"Ollie","profession":"Actuary","city":"Miastków Kościelny"},
        {"name":"Penelopa","profession":"Senior Financial Analyst","city":"Beloostrov"},
        {"name":"Brena","profession":"Assistant Manager","city":"San Nicolas"},
        {"name":"Bil","profession":"Mechanical Systems Engineer","city":"Jangdam"},
        {"name":"Elisabet","profession":"Structural Engineer","city":"San Carlos"},
        {"name":"Tanner","profession":"Speech Pathologist","city":"Hamburg"},
        {"name":"Larine","profession":"Sales Associate","city":"Itigi"},
        {"name":"Audrye","profession":"Biostatistician IV","city":"‘Awaj"},
        {"name":"David","profession":"Senior Cost Accountant","city":"Rybatskoye"},
        {"name":"Brendin","profession":"Media Manager IV","city":"Karanglo"},
        {"name":"Vanni","profession":"Environmental Specialist","city":"Amboasary"},
        {"name":"Carey","profession":"Computer Systems Analyst IV","city":"Ngamba"},
        {"name":"Arlen","profession":"Media Manager I","city":"Fucheng"},
        {"name":"Vida","profession":"Senior Developer","city":"Ngurensiti"},
        {"name":"Shermy","profession":"Graphic Designer","city":"Rekowo Dolne"},
        {"name":"Georgetta","profession":"Information Systems Manager","city":"Jangdam"},
        {"name":"Felix","profession":"Human Resources Assistant II","city":"Ivot"},
        {"name":"Fabiano","profession":"Software Engineer II","city":"Budapest"},
        {"name":"Blakeley","profession":"Nurse Practicioner","city":"Jinping"},
        {"name":"Greggory","profession":"Nurse","city":"Shuangmiao"},
        {"name":"Isac","profession":"Software Engineer II","city":"Songgang-dong"},
        {"name":"Sutherland","profession":"Account Executive","city":"Legionowo"},
        {"name":"Lenore","profession":"Sales Representative","city":"Kinamayan"},
        {"name":"Raynor","profession":"Marketing Manager","city":"Rtishchevo"},
        {"name":"Alysa","profession":"Senior Sales Associate","city":"Komarno"},
        {"name":"Eric","profession":"Environmental Tech","city":"Sintansin"},
        {"name":"Suzie","profession":"VP Product Management","city":"Glushkovo"},
        {"name":"Ahmad","profession":"Computer Systems Analyst I","city":"Fort-de-France"},
        {"name":"Estella","profession":"Electrical Engineer","city":"Cupira"},
        {"name":"Frank","profession":"Director of Sales","city":"Vyshneve"},
        {"name":"Rinaldo","profession":"Recruiting Manager","city":"Rio Claro"},
        {"name":"Ailey","profession":"Safety Technician III","city":"Tor"},
        {"name":"Ronna","profession":"Professor","city":"Tékane"},
        {"name":"Olvan","profession":"Automation Specialist III","city":"Batarasa"},
        {"name":"Yanaton","profession":"Director of Sales","city":"Gaoqiao"},
        {"name":"Rabi","profession":"Assistant Professor","city":"Sokolovyy"},
        {"name":"Tanya","profession":"VP Sales","city":"Kertasari"},
        {"name":"Maiga","profession":"Account Coordinator","city":"Hatsukaichi"},
        {"name":"Lia","profession":"Developer III","city":"Beizhakou"},
        {"name":"Aindrea","profession":"Senior Quality Engineer","city":"Mahuta"},
        {"name":"Deeanne","profession":"Recruiting Manager","city":"Qijiazuo"},
        {"name":"Nikoletta","profession":"Chief Design Engineer","city":"Glushkovo"},
        {"name":"Aurlie","profession":"Programmer II","city":"Washington"},
        {"name":"Renaud","profession":"Research Assistant I","city":"Lakha Nëvre"},
        {"name":"Germayne","profession":"Operator","city":"Bodzentyn"},
        {"name":"Elvis","profession":"Editor","city":"Maciejowice"},
        {"name":"Margarette","profession":"Sales Representative","city":"Tajan"},
        {"name":"Antonie","profession":"VP Product Management","city":"Suren"},
        {"name":"Keelby","profession":"Chemical Engineer","city":"Mombetsu"},
        {"name":"Petunia","profession":"GIS Technical Architect","city":"Sai"},
        {"name":"Georgette","profession":"Administrative Officer","city":"San Antonio"},
        {"name":"Clement","profession":"Research Associate","city":"Louguan"},
        {"name":"Stillman","profession":"Assistant Manager","city":"Lingzhi"},
        {"name":"Wadsworth","profession":"Media Manager II","city":"Zuru"},
        {"name":"Riobard","profession":"Marketing Manager","city":"Bojonggenteng"},
        {"name":"Clary","profession":"Payment Adjustment Coordinator","city":"Beixiang"},
        {"name":"Oberon","profession":"Assistant Professor","city":"Digkilaan"},
        {"name":"Park","profession":"Librarian","city":"Punaauia"},
        {"name":"Celka","profession":"Office Assistant II","city":"Gedian"},
        {"name":"Bambie","profession":"Data Coordiator","city":"Diaofeng"},
        {"name":"Davida","profession":"Software Test Engineer II","city":"Gardanne"},
        {"name":"Addison","profession":"Tax Accountant","city":"Kisii"},
        {"name":"Lanae","profession":"Financial Analyst","city":"Canoas"},
        {"name":"Ryley","profession":"Biostatistician II","city":"Kwangmyŏng"},
        {"name":"Barbabas","profession":"Health Coach I","city":"Golek"},
        {"name":"Annadiane","profession":"Assistant Manager","city":"São Pedro de Trafaria"},
        {"name":"Becca","profession":"Pharmacist","city":"Beloye"},
        {"name":"Ladonna","profession":"Associate Professor","city":"Gandusari"},
        {"name":"Nickolaus","profession":"Systems Administrator III","city":"Rizal"},
        {"name":"Stoddard","profession":"Internal Auditor","city":"Záhorovice"},
        {"name":"Daisi","profession":"Nuclear Power Engineer","city":"Warugunung"},
        {"name":"Ekaterina","profession":"Administrative Officer","city":"Mali Iđoš"},
        {"name":"Netti","profession":"Librarian","city":"Pilar"},
        {"name":"Zed","profession":"Assistant Media Planner","city":"Göteborg"},
        {"name":"Libbey","profession":"Developer IV","city":"Ćmielów"},
        {"name":"Rosanne","profession":"Budget/Accounting Analyst III","city":"Taekas"},
        {"name":"Paige","profession":"Director of Sales","city":"Caleufú"},
        {"name":"Dex","profession":"Engineer I","city":"Zhaoxian"},
        {"name":"Ferris","profession":"Engineer I","city":"Danjiangkou"},
        {"name":"Markus","profession":"Assistant Professor","city":"Dabu"},
        {"name":"Payton","profession":"Media Manager II","city":"Yushugou"},
        {"name":"Rosalinda","profession":"Community Outreach Specialist","city":"Sunduan"},
        {"name":"Cly","profession":"Programmer II","city":"Tasikmalaya"},
        {"name":"Jasun","profession":"Software Consultant","city":"Kotatengah"},
        {"name":"Marcella","profession":"Social Worker","city":"Inabaan Sur"},
        {"name":"Peggie","profession":"Clinical Specialist","city":"Tha Ruea"},
        {"name":"Tabbie","profession":"Quality Engineer","city":"Arthur’s Town"},
        {"name":"Erna","profession":"Automation Specialist II","city":"Yangping"},
        {"name":"Lynn","profession":"Senior Sales Associate","city":"Tigbinan"},
        {"name":"Baudoin","profession":"GIS Technical Architect","city":"Plakhtiyivka"},
        {"name":"Colleen","profession":"Speech Pathologist","city":"Campelos"},
        {"name":"Burk","profession":"VP Accounting","city":"Surenavan"},
        {"name":"Nadeen","profession":"Tax Accountant","city":"Shchelkovo"},
        {"name":"Buckie","profession":"Pharmacist","city":"Bulri"},
        {"name":"Ezequiel","profession":"Accounting Assistant III","city":"Irshava"},
        {"name":"Allan","profession":"Environmental Tech","city":"Kỳ Anh"}
      ];

      if(tableState && tableState.filterList.length && tableState.filterList.some(val => val.length)) {
        data = data.filter(val => tableState.filterList.some(filter => JSON.stringify(val).includes(filter[0])));
      }

      const count = data.length;

      setTimeout(() => {
        resolve({ data: data.slice(page*rowsPerPage, page*rowsPerPage + rowsPerPage), count });
      }, 2500);

    });

  }

  changePage = (tableState) => {
    this.xhrRequest(tableState).then(({ data, count }) => {
      this.setState({
        page: tableState.page,
        data,
        count
      });
    });
  };

  filterTable = (tableState) => {
    this.xhrRequest(tableState).then(({ data, count }) => {
      this.setState({
        data,
        count
      });
    });
  }

  render() {

    const columns = [
      {
        label: "Name",
        name: "name"
      },
      {
        label: "Title",
        name: "profession"
      },
      {
        label: "Location",
        name: "city"
      }
    ];
    const { data, page, count, isLoading } = this.state;

    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'stacked',
      serverSide: true,
      count: count,
      rowsPerPage: 10,
      page: page,
      onTableChange: (action, tableState) => {

        console.log(action, tableState);
        // a developer could react to change on an action basis or
        // examine the state as a whole and do whatever they want

        switch (action) {
          case 'changePage':
            this.changePage(tableState);
            break;
          case 'filterChange':
            this.filterTable(tableState);
            break;
          default:
        }
      }
    };

    return (
      <div>
        {isLoading && <CircularProgress style={{ marginLeft: '50%' }} />}
        <MUIDataTable title={"ACME Employee list"} data={data} columns={columns} options={options} />
      </div>
    );

  }
}

ReactDOM.render(<Example />, document.getElementById("app-root"));
