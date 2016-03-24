using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.Design;
using System.ComponentModel.Design.Serialization;
using System.Drawing;
using System.Drawing.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Windows.Forms.Design;

namespace System.Windows.Forms.Design
{
    [ToolboxItemFilter("System.Windows.Forms")]
    public abstract class DocumentDesigner : ScrollableControlDesigner, IParentDesigner, IDesigner, IRootDesigner, ISelectionService, IDesignerSerializationService, IToolboxUser, IDisposable
    {
        MenuEditorService MenuEditorService;
        private System.Windows.Forms.Control rootControl;
        private IComponent rootComponent;
        public IDesigner GetParentDesinger()
        {
            return (IDesigner)this;
        }

        public object GetParentService(Type objType)
        {
            if (objType == typeof(IMenuEditorService))
                return (object)this.MenuEditorService;

            return this.GetService(objType);
        }

        public object GetView(ViewTechnology technology)
        {
            if (rootControl == null)
            {
                rootControl = new System.Windows.Forms.Control();
            }
            return rootControl;
        }

        public ViewTechnology[] SupportedTechnologies
        {
            get { return new ViewTechnology[] { ViewTechnology.Default }; }
        }

        public bool GetComponentSelected(object component)
        {
            return false;
        }

        public ICollection GetSelectedComponents()
        {
            return null;
        }

        public object PrimarySelection
        {
            get
            {
                return this.WebSelectionService.PrimarySelection;
            }
        }

        private ISelectionService WebSelectionService
        {
            get
            {
                return (ISelectionService)this.GetService(typeof(ISelectionService));
            }
        }

        public event EventHandler SelectionChanged;

        public event EventHandler SelectionChanging;

        public int SelectionCount
        {
            get { return this.WebSelectionService.SelectionCount; }
        }

        public void SetSelectedComponents(ICollection components, SelectionTypes selectionType)
        {
            this.WebSelectionService.SetSelectedComponents(components, selectionType);
        }

        public void SetSelectedComponents(ICollection components)
        {
            this.WebSelectionService.SetSelectedComponents(components);
        }

        public ICollection Deserialize(object serializationData)
        {
            return null;
        }

        public object Serialize(ICollection objects)
        {
            return null;
        }

        public bool GetToolSupported(ToolboxItem tool)
        {
            return true;
        }

        public void ToolPicked(ToolboxItem tool)
        {
            
        }
    }

    internal class MenuEditorService : IMenuEditorService
    {
        private IMenuEditorService menuEditorService;
        private DocumentDesigner parentDesigner;

        public MenuEditorService(DocumentDesigner objClientDocumentDesigner, IMenuEditorService objInternalClientDocumentDesigner)
        {
            this.menuEditorService = objInternalClientDocumentDesigner;
            this.parentDesigner = objClientDocumentDesigner;
        }

        public Menu GetMenu()
        {
            return this.menuEditorService.GetMenu();
        }

        public bool IsActive()
        {
            return this.menuEditorService.IsActive();
        }

        public bool MessageFilter(ref Message m)
        {
            return this.menuEditorService.MessageFilter(ref m);
        }

        public void SetMenu(Menu menu)
        {
            this.menuEditorService.SetMenu(menu);
        }

        public void SetSelection(MenuItem item)
        {
            if (item.Container != null)
            {
                this.menuEditorService.SetSelection(item);
            }
        }
    }
}
