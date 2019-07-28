import 'flatpickr/dist/themes/light.css'
import Flatpickr from "flatpickr";
import 'construct-ui/lib/index.css'
import m from 'mithril';
import {
  Button,
  Icons,
  CustomSelect,
  ButtonGroup,
  Drawer,
  Dialog,
  SelectList,
  ListItem,
  FocusManager,
  Card,
  Icon,
  Grid,
  Col,
  Tabs,
  TabItem,
  InputSelect,
  Table,
  Colors,
  FormGroup,
  FormLabel,
  Form,
  Input,
  List,
  Tag,
  ControlGroup,
  Select,
  PopoverMenu,
  MenuItem,
  Menu,
  Checkbox
} from "construct-ui";


import types from "../types.json";
import constraints from "../constaints.json";
import { Divider } from 'semantic-ui-react';
import { DB } from './util';

var type_map = {
  "instructor": "instructors",
  "course": "courses",
  "room": "rooms"
}

function isBaseType(type) {
  for(var i in types["base_types"]) {
    var btype = types.base_types[i]
    if(btype == type)
      return true;
  }
  return false;
}

class BoolInput {
  selectedItem : any;
  fid : string;
  ftype : string;
  view(vnode : any) {
    this.selectedItem = vnode.attrs.selectedItem;
    this.fid = vnode.attrs.fid;
    this.ftype = vnode.attrs.ftype;

    if(!this.selectedItem[this.fid]) {
      this.selectedItem[this.fid] = false;
    }

    return m(Checkbox, {
      checked: this.selectedItem[this.fid],
      class:"checkbox",
      size: "xl",
      onchange: (e)=>this.onchange(e)
    })
  }

  onchange(e:any) {
    this.selectedItem[this.fid] = !this.selectedItem[this.fid];
  } 
}

class Timepicker {
  picker:any;
  selectedItem : any;
  fid : string;
  ftype : string;
  oncreate(vnode:any) {
    this.selectedItem = vnode.attrs.selectedItem;
    this.fid = vnode.attrs.fid;
    this.ftype = vnode.attrs.ftype;

    if(this.picker)
      this.picker.destroy();

    this.picker = Flatpickr(vnode.dom, {
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",
      defaultDate: "8:00",
      onChange: (selectedDates, dateStr, instance) => {this.selectedItem[this.fid] = dateStr; m.redraw()},
    });
  }
  onremove(){
    if(this.picker)
      this.picker.destroy();
  }
  view(vnode: any) {
    this.selectedItem = vnode.attrs.selectedItem;
    this.fid = vnode.attrs.fid;
    this.ftype = vnode.attrs.ftype;

    return m(StringInput, {
      fid: this.fid,
      ftype: this.ftype,
      selectedItem: this.selectedItem
    });
  }
}

class DeleteButton {
  selectedItem : any;
  fid : any;
  index : any;

  view(vnode : any) {
    this.selectedItem = vnode.attrs.selectedItem;
    this.fid = vnode.attrs.fid;
    this.index = vnode.attrs.index;
    return m(Button, {label: "Delete", iconLeft: Icons.X, onclick: (e: Event)=>{this.onclick(e)}, class:"listdelete"});
  }

  onclick(e : Event) {
    var elem = e.target as any;
    this.selectedItem[this.fid].splice(this.index, 1);
  }
}
class ArrComponent {
  selectedItem : any;
  fid : string;
  ftype : string;
  view(vnode: any) {
    this.selectedItem = vnode.attrs.selectedItem;
    this.fid = vnode.attrs.fid;
    this.ftype = vnode.attrs.ftype;

    var forms = [];
    for(var i in this.selectedItem[this.fid]) {
      forms.push(m(".listgrid", [
        m(".listitem", m(Properties, {type: this.ftype, selectedItem: this.selectedItem[this.fid][i]})),
        m(DeleteButton, {selectedItem:this.selectedItem, fid:this.fid, index:i})
      ]));
      forms.push(m(ListItem, {}));

    }
    forms.push(m("br"))
    forms.push(m(Card, {class:"listadd", fluid: true}, 
      m(Button, { label: "add " + this.ftype,  onclick: ()=>this.addElem(), fluid: true, basic: true})
    )
    )

    return forms;
  }

  addElem() {
    if(!this.selectedItem[this.fid]) {
      this.selectedItem[this.fid] = []
    }
    this.selectedItem[this.fid].push({});
    m.redraw();
  }
  
}

class Pointer {
  private selectedItem : any;
  private type : any;
  private index : number;
  view(vnode: any) {
    this.type = vnode.attrs.type;
    this.selectedItem = vnode.attrs.selectedItem;
    this.index = vnode.attrs.index;

    var initvalue = null;
    if(this.selectedItem[this.index]) {
      initvalue = this.selectedItem[this.index];
    }
    return m(Selector, {type:this.type, onselect: (item)=>this.onselect(item), initialvalue: initvalue})
  }

  onselect(item) {
    this.selectedItem[this.index] = item;
  }
}

class PArrComponent {
  selectedItem : any;
  fid : string;
  ftype : string;
  view(vnode: any) {
    this.selectedItem = vnode.attrs.selectedItem;
    this.fid = vnode.attrs.fid;
    this.ftype = vnode.attrs.ftype;

    var forms = [];
    for(var i in this.selectedItem[this.fid]) {
      forms.push(m(".listgrid", [
        m(".listitem", m(Pointer, {type: this.ftype, selectedItem: this.selectedItem[this.fid], index: i})),
        m(DeleteButton, {selectedItem:this.selectedItem, fid:this.fid, index:i})
      ]));
      forms.push(m(ListItem, {}));

    }
    forms.push(m("br"))
    forms.push(m(Card, {class:"listadd", fluid: true}, 
      m(Button, { label: "add " + this.ftype,  onclick: ()=>this.addElem(), fluid: true, basic: true})
    )
    )

    return forms;
  }

  addElem() {
    if(!this.selectedItem[this.fid]) {
      this.selectedItem[this.fid] = []
    }
    this.selectedItem[this.fid].push("");
    m.redraw();
  }
  
}

class IntInput {
  selectedItem : any;
  fid : string;
  ftype : string;
  view(vnode: any) {
    this.selectedItem = vnode.attrs.selectedItem;
    this.fid = vnode.attrs.fid;
    this.ftype = vnode.attrs.ftype;
    return m(Input, {
      id: this.fid,
      name: this.ftype,
      value: this.selectedItem[this.fid],
      onchange: (e:Event) => {this.selectedItem[this.fid] = parseInt((e.target as HTMLInputElement).value);},
      type: "number",
    });
  }
}

class StringInput {
  selectedItem : any;
  fid : string;
  ftype : string;
  view(vnode: any) {
    this.selectedItem = vnode.attrs.selectedItem;
    this.fid = vnode.attrs.fid;
    this.ftype = vnode.attrs.ftype;
    return m(Input, {
      id: this.fid,
      name: this.ftype,
      value: this.selectedItem[this.fid],
      onchange: (e:Event) => {this.selectedItem[this.fid] = (e.target as HTMLInputElement).value;}
    });
  }
}

function getComponent(fid : string, ftype : string, item : any) {
    const span = {
      xs: 12,
      sm: 12,
      md: 6
    };

  var label = m("h4", fid)//m(FormLabel, { for: fid }, m("h4", fid));
  var input = m("input");
  switch(ftype) {
    case "int":
        input = m(IntInput, {
          fid: fid,
          ftype: ftype,
          selectedItem: item
        });
      break;
    case "string":
      input = m(StringInput, {
        fid: fid,
        ftype: ftype,
        selectedItem: item
      });
      break;
    case "time":
      input = m(Timepicker, {
        fid: fid,
        ftype: ftype,
        selectedItem: item
      });
      break;
    case "bool":
      input = m(BoolInput, {
        fid: fid,
        ftype: ftype,
        selectedItem: item
      });
      break;
    default:
      var lchar = ftype[ftype.length-1];
      if( lchar == "]" || lchar == "*") {
        if(lchar == "]") {
          var arrtype = ftype.substr(0, ftype.length-2);
          label = m("div", [m("h3", fid), m("hr")]);
          input = m(ArrComponent, {fid: fid,
            ftype: arrtype,
            selectedItem: item});
        } else {
          var arrtype = ftype.substr(0, ftype.length-1);
          label = m("div", [m("h3", fid), m("hr")]);
          input = m(PArrComponent, {fid: fid,
            ftype: arrtype,
            selectedItem: item});
        }
      }
      else {
        return []
      }
      return m("div", [
        label,
        input,
      ]);
      break;
  }

  return m(".property", {}, [
    label,
    input,
  ]);
}

function getInputComponent(fid : string | number, ftype : string, item : any) {
  var input = m("input");
  switch(ftype) {
    case "int":
        input = m(IntInput, {
          fid: fid,
          ftype: ftype,
          selectedItem: item
        });
      break;
    case "string":
      input = m(StringInput, {
        fid: fid,
        ftype: ftype,
        selectedItem: item
      });
      break;
    case "time":
      input = m(Timepicker, {
        fid: fid,
        ftype: ftype,
        selectedItem: item
      });
      break;
    case "bool":
        input = m(BoolInput, {
          fid: fid,
          ftype: ftype,
          selectedItem: item
        });
        break;
    default:
      input = m(Pointer, {type:ftype, selectedItem: item, index: fid})
      break;
  }

  return input;
}

class ConstraintData {
  selectedOn : string;
  selectedAction : string;
  type: string;
}

class Constraint {

  cid: string;
  constraintobj:any = {};
  options : any[];
  type: string;
  selectedItem: any;


  view(vnode: any) {
    this.type = vnode.attrs.type;
    this.selectedItem = vnode.attrs.selectedItem;
    

    if(!this.selectedItem) {
      this.selectedItem = new ConstraintData();
    }
    var onoptions = constraints.for[this.type].on;
    if(!this.selectedItem.selectedOn) {
      this.selectedItem.selectedOn = onoptions[0];
    }
    if(!this.selectedItem.selectedAction) {
      this.selectedItem.selectedAction = "";
    }

    
    var onMenu = this.createOnMenu(onoptions);

    

    var btype = "";
    var pointer = false;
    if(this.selectedItem.selectedOn == "time") {
      btype = "time";
    } else {
      var split = this.selectedItem.selectedOn.split('.');
      if(split.length > 1) {
        var parent = split[split.length-2];
        var base = split[split.length-1];
        if(base == "_id") {
          btype = parent;
          pointer = true;
        }
        else {
          btype = types[parent][base];
        }
      }
    }
    
    this.selectedItem.type = btype;
    if(pointer)
      this.selectedItem.type = "_id";
    var actions = this.createActionsMenu(constraints.actions, btype);
    

    var onbutton = m(Button, {
      //basic: true,
      label: this.selectedItem.selectedOn,
      iconRight: Icons.CHEVRON_DOWN
    })

    var buttonLabel = constraints.actions[this.selectedItem.selectedAction] && constraints.actions[this.selectedItem.selectedAction].label
    var actionbutton = m(Button, {
      //basic: true,
      label: buttonLabel,
      iconRight: Icons.CHEVRON_DOWN
    })

    var inputComponents = [];
    if(this.selectedItem.selectedAction && this.selectedItem.selectedOn) {
      var actionobj = constraints.actions[this.selectedItem.selectedAction];
      var varsnum = actionobj.varsnum;
      this.selectedItem.varsnum = actionobj.varsnum;
      for(var i = 0; i < varsnum; i++) {
        inputComponents.push(getInputComponent("var"+i, btype, this.selectedItem))
      }
    }
    

    return m(".constraint", {}, m(ButtonGroup,{},[
      
      m(PopoverMenu , {
        trigger: onbutton,
        content: onMenu,
        style: "constraint-button",
        position: "auto",
        closeOnContentClick: true
      }),
      m(PopoverMenu , {
        trigger: actionbutton,
        content: actions,
        style: "constraint-button",
        position: "auto",
        closeOnContentClick: true
      }),
      inputComponents
    ]));
  }

  setOn(e) {
    this.selectedItem.selectedOn = e.currentTarget.innerText
  }

  setAction(e) {
    for(var action in constraints.actions) {
      var a = constraints.actions[action]
      if(e.currentTarget.innerText == a.label){
        this.selectedItem.selectedAction = action;
      }
    }
  }

  createOnMenu(onoptions) {
    var menu = []
    for(var i in onoptions) {
      var type = onoptions[i];
      if(type == "time") {
        menu.push(m(MenuItem, {
          label: "time",
          onclick: (e)=>this.setOn(e)
        }))
      } else if(types[type]) {
        var submenu = []
        submenu.push(m(MenuItem, {
          label: type+"._id",
          onclick: (e)=>this.setOn(e)
        }))
        for(var p in types[type]) {
          if(isBaseType(types[type][p])) {
            submenu.push(m(MenuItem, {
              label: type+"."+p,
              onclick: (e)=>this.setOn(e)
            }))
          }
        }

        menu.push(m(MenuItem, {
          label: type,
          submenu: submenu
        }))
      }
    }
    return menu
  }

  createActionsMenu(actions, ontype) {
    var menu = []
    for(var action in actions) {
      var a = actions[action];
      var found = false;
      for(var i in a.types){
        var type = a.types[i];
        
        if(type==ontype) {
          found = true;
          break;
        }
      }

      if(found) {
        if(!this.selectedItem.selectedAction)
        this.selectedItem.selectedAction = action;
        menu.push(m(MenuItem, {
          label: a.label,
          onclick: (e)=>this.setAction(e)
        }))
      }
    }
    return menu
  }
}

class Constraints {
  selectedItem : any;
  type : string;
  view(vnode: any) {
    this.selectedItem = vnode.attrs.selectedItem;
    this.type = vnode.attrs.type;

    var forms = [];
    for(var i in this.selectedItem["constraints"]) {
      forms.push(m("span.constraints", [
        m(Constraint, {type: this.type, selectedItem: this.selectedItem["constraints"][i]}),
        m(DeleteButton, {selectedItem:this.selectedItem, fid:"constraints", index:i})
      ]))
      forms.push(m(ListItem, {}));
    }
    forms.push(
      m(ListItem, {label:
         m(Button, {label: "add constraint",  onclick: ()=>this.addElem(), class:".listadd", fluid:true, basic:true})
      })
    )

    return m("span", {interactive:false}, forms);
  }

  addElem() {
    if(!this.selectedItem["constraints"]) {
      this.selectedItem["constraints"] = []
    }
    this.selectedItem["constraints"].push({});
    m.redraw();
  }
  
}

export class Properties {
  propForm: any[] = [];
  active : string | any[] = "p";
  loading: boolean = false;
  formBody: any;
  selectedItem : any = {};

  generateView(type) {
    for(var f in type) {
      this.propForm.push(getComponent(f, type[f], this.selectedItem));
    }
  }

  view(vnode: any) {
    var type = vnode.attrs.type;
    this.selectedItem = vnode.attrs.selectedItem;
    this.selectedItem.type = type;
    this.propForm = [];
    if(types[type]) {
      this.generateView(types[type]);
    }

    var constraintsElem : any = []
    if(constraints.for[type]) {
      constraintsElem = m("fieldset.properties", [m("legend.properties-legend", "Constraints"), m(Constraints, {selectedItem: this.selectedItem, type: type})])
    }
    return m(".profile-form", {}, [
      m("br"),
      m("fieldset.properties", [m("legend.properties-legend", "Properties"), this.propForm]),
      m("br"),
      constraintsElem
    ]);
  }
}

let QList = SelectList.ofType<string>();
class Selector {
  private list : string[];
  private selectedItem: string;
  private closeOnSelect = true;
  private loading = false;
  private db : string;
  private type : string;
  private onselect: any;
  private initialvalue : any;

  public view(vnode: any) {
    this.type = vnode.attrs.type;
    this.db = type_map[this.type];
    this.onselect = vnode.attrs.onselect;
    this.initialvalue = vnode.attrs.initialvalue;

    if(this.initialvalue != null && !this.selectedItem) {
      this.selectedItem = this.initialvalue;
    }

    this.list = DB.getList(this.db);

    
    if(this.list == null) {
      this.list = [];
      this.selectedItem = "";
      this.loading = true;
    } else {
      this.loading = false;
    }
  
    return m(QList, {
          closeOnSelect: this.closeOnSelect,
          items: this.list,
          itemRender: this.renderItem,
          itemPredicate: this.itemPredicate,
          onSelect: this.handleSelect,
          loading: this.loading,
          popoverAttrs: {
            hasArrow: true,
            position: "auto"
          },
          trigger: m(Button, {
            iconRight: Icons.CHEVRON_DOWN,
            sublabel: this.type,
            label: this.selectedItem && this.selectedItem.substring(0,20),
          })
      })
  }

  private renderItem = (item: string) => m(ListItem, {
    label: item,
    selected: this.selectedItem === item,
  })

  private itemPredicate(query: string, item: string) {
    return item.toLowerCase().includes(query.toLowerCase());
  }

  private handleSelect = (item: string) => {
    this.selectedItem = item;
    this.onselect(item);
  }

}