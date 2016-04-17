using Bridge;
using Bridge.Html5;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Windows.Forms
{
    public class ListView : Control
    {
        private List<ColumnHeader> mColumns;
        public List<ColumnHeader> Columns
        {
            get
            {
                return mColumns;
            }
            set
            {
                mColumns = new List<ColumnHeader>();
                foreach(var col in value)
                {
                    mColumns.Add(JSON.Parse<ColumnHeader>(JSON.Stringify(col)));
                }
            }
        }

        private List<ListViewItem> mItems;
        public List<ListViewItem> Items
        {
            get
            {
                return mItems;
            }
            set
            {
                mItems = new List<ListViewItem>();
                foreach(var item in value)
                {
                    mItems.Add(JSON.Parse<ListViewItem>(JSON.Stringify(item)));
                }
                
            }
        }

        public override void Update(WSEventArgs evt)
        {
            base.Update(evt);
            var table = (qx.ui.table.Table)this.Element;
            switch (evt.EventType)
            {
                case "clearList":
                    {
                        var model = (qx.ui.table.model.Simple)table.TableModel;
                        model.RemoveRows(0, model.RowCount);
                    }
                    break;
                case "addListViewItem":
                    {
                        var item = JSON.Parse<ListViewItem>(evt.Value.ToString());
                        mItems.Add(item);
                        object[][] data = new object[this.Columns.Count][];

                        for (int i = 0; i < this.Columns.Count; i++)
                        {
                            data[i] = new object[1];
                            data[i][0] = item.SubItems[i];
                        }
                        var model = (qx.ui.table.model.Simple)table.TableModel;
                        model.AddRows(data);
                    }
                    break;
            }
        }

        private void RenderItems()
        {
            var table = (qx.ui.table.Table)this.Element;
            var model = (qx.ui.table.model.Simple)table.TableModel;
            object[][] data = new object[this.Columns.Count][];

            for (int i = 0; i < this.Columns.Count; i++)
            {
                data[i] = new object[this.Items.Count];
                for (int x = 0; x < this.Items.Count; x++)
                {
                    var item = this.Items[x];
                    data[i][x] = item.SubItems[i];
                }
            }

            model.AddRows(data);
        }

        public override void Render()
        {
            var model = new qx.ui.table.model.Simple();
            if (this.Columns.Count > 0)
            {
                string[] columnNames = new string[this.Columns.Count];
                for (int i = 0; i < this.Columns.Count; i++)
                {
                    var col = this.Columns[i];
                    columnNames[i] = col.ColumnName;
                }

                model.SetColumns(columnNames);
            }

            var table = new qx.ui.table.Table(model);
            this.Element = table;
            base.Render();

            RenderItems();

            //            this.Element = document.createElement('div');
            //            var size = obj.Size.split(',');
            //            var width = size[0] + 'px';
            //            var height = size[1] + 'px';

            //            var columns = [];

            //            var model = { };

            //            for (var i = 0; i < obj.Columns.length; i++)
            //            {
            //                var shortName = obj.Columns[i].ColumnName.replace(/\s +/ g, '') + '_' + i;
            //                var column = {
            //            field: shortName,
            //            width: obj.Columns[i].Width,
            //            title: obj.Columns[i].ColumnName
            //                };
            //            model[shortName] = {
            //                type: "string"
            //            }
            //            columns.push(column);
            //        }

            //        var dt = [];

            //        var options = {
            //        height: height,
            //        width: width,
            //        autoBind: false,
            //        columns: columns,
            //        scrollable: true,
            //        sortable: true,
            //        filterable: true,
            //        pageable: {
            //            input: true,
            //            numeric: false
            //        },
            //        dataSource: {
            //            data: dt,
            //            schema: {
            //                model: {
            //                    fields: model
            //                }
            //            },
            //            pageSize: 20
            //        },
            //    };

            //        var str = JSON.stringify(options);

            //    $(this.Element).kendoGrid(options);

            //        var grid = $(this.Element).data("kendoGrid");
            //    for (var i = 0; i<obj.Items.length; i++) {
            //        var item = obj.Items[i];
            //        var row = { };
            //        for (var x = 0; x<grid.columns.length; x++) {
            //            var column = grid.columns[x];
            //        var rowValue = item.SubItems[x];
            //        row[column.field] = rowValue;
            //        }
            //    grid.dataSource.add(row);
            //    }

            //Control.prototype.Render(this.Element, obj, parent);
            base.Render();

            //KendoGrid grid = new KendoGrid();
            //grid.AutoBind = false;
            //grid.Sortable = true;
            //grid.Filterable = true;

            //KendoGrid.Element(this.Element, grid);

            //this.Element.Style.BorderStyle = BorderStyle.Solid;
            //this.Element.Style.BorderWidth = BorderWidth.Thin;
            //this.Element.Style.BorderColor = "gray";
        }
    }

    public class KendoGrid
    {
        [Template("$({0}).kendoGrid({1})")]
        public static Fancytree Element(Element elm, KendoGrid options)
        {
            return null;
        }
        public int Height;
        public int Width;
        public bool AutoBind = false;
        public bool Scrollable = true;
        public bool Sortable = true;
        public bool Filterable = true;
        public KendoGuidPageable Pageable = new KendoGuidPageable();
        public KendoGridDataSource DataSource;

        public class KendoGuidPageable
        {
            public bool Input = true;
            public bool Numeric = false;
        }

        public class KendoGridDataSource
        {
            public object Data;
            public int PageSize;

            public KendoGridDataSourceSchema Schema = new KendoGridDataSourceSchema();

            public class KendoGridDataSourceSchema
            {
                public KendoGridDataSourceSchemaModel Model = new KendoGridDataSourceSchemaModel();

                public class KendoGridDataSourceSchemaModel
                {
                    public object Fields;
                }
            }
        }
    }
}
