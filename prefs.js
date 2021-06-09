// -*- mode: js2; indent-tabs-mode: nil; js2-basic-offset: 4 -*-

/* exported init, buildPrefsWidget */

const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const Gettext = imports.gettext.domain(Me.metadata['gettext-domain']);
const _ = Gettext.gettext;

function init() {
    ExtensionUtils.initTranslations();
}

const AppIndicatorPreferences = GObject.registerClass(
class AppIndicatorPreferences extends Gtk.Box {
    _init() {
        super._init( { orientation: Gtk.Orientation.VERTICAL, spacing: 30 } );
        this._settings = ExtensionUtils.getSettings();

        let label = null;
        let widget = null;
        
        
        this.preferences_vbox = new Gtk.Box({orientation: Gtk.Orientation.VERTICAL,
            spacing: 8,
            border_width: 30});
        this.custom_icons_vbox = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 10,
            border_width: 10});
        
        
        // Icon opacity
        this.opacity_hbox = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 10,
            border_width: 10});
        label = new Gtk.Label({
            label: _('Opacity (min: 0, max: 255)'),
            hexpand: true,
            halign: Gtk.Align.START,
        });
        widget = new Gtk.SpinButton({ halign: Gtk.Align.END });
        widget.set_sensitive(true);
        widget.set_range(0, 255);
        widget.set_value(this._settings.get_int('icon-opacity'));
        widget.set_increments(1, 2);
        widget.connect('value-changed', w => {
            this._settings.set_int('icon-opacity', w.get_value_as_int());
        });
        this.opacity_hbox.pack_start(label, true, true, 0);
        this.opacity_hbox.pack_start(widget, false, false, 0);
        
        // Icon saturation
        this.saturation_hbox = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 10,
            border_width: 10});
        label = new Gtk.Label({
            label: _('Desaturation (min: 0.0, max: 1.0)'),
            hexpand: true,
            halign: Gtk.Align.START,
        });
        widget = new Gtk.SpinButton({ halign: Gtk.Align.END, digits: 1 });
        widget.set_sensitive(true);
        widget.set_range(0.0, 1.0);
        widget.set_value(this._settings.get_double('icon-saturation'));
        widget.set_increments(0.1, 0.2);
        widget.connect('value-changed', w => {
            this._settings.set_double('icon-saturation', w.get_value());
        });
        this.saturation_hbox.pack_start(label, true, true, 0);
        this.saturation_hbox.pack_start(widget, false, false, 0);
        
        // Icon brightness
        this.brightness_hbox = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 10,
            border_width: 10});
        label = new Gtk.Label({
            label: _('Brightness (min: -1.0, max: 1.0)'),
            hexpand: true,
            halign: Gtk.Align.START,
        });
        widget = new Gtk.SpinButton({ halign: Gtk.Align.END, digits: 1 });
        widget.set_sensitive(true);
        widget.set_range(-1.0, 1.0);
        widget.set_value(this._settings.get_double('icon-brightness'));
        widget.set_increments(0.1, 0.2);
        widget.connect('value-changed', w => {
            this._settings.set_double('icon-brightness', w.get_value());
        });
        this.brightness_hbox.pack_start(label, true, true, 0);
        this.brightness_hbox.pack_start(widget, false, false, 0);

        // Icon contrast
        this.contrast_hbox = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 10,
            border_width: 10});
        label = new Gtk.Label({
            label: _('Contrast (min: -1.0, max: 1.0)'),
            hexpand: true,
            halign: Gtk.Align.START,
        });
        widget = new Gtk.SpinButton({ halign: Gtk.Align.END, digits: 1 });
        widget.set_sensitive(true);
        widget.set_range(-1.0, 1.0);
        widget.set_value(this._settings.get_double('icon-contrast'));
        widget.set_increments(0.1, 0.2);
        widget.connect('value-changed', w => {
            this._settings.set_double('icon-contrast', w.get_value());
        });
        this.contrast_hbox.pack_start(label, true, true, 0);
        this.contrast_hbox.pack_start(widget, false, false, 0);

        // Icon size
        this.icon_size_hbox = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 10,
            border_width: 10});
        label = new Gtk.Label({
            label: _('Icon size (min: 0, max: 96)'),
            hexpand: true,
            halign: Gtk.Align.START,
        });
        widget = new Gtk.SpinButton({ halign: Gtk.Align.END });
        widget.set_sensitive(true);
        widget.set_range(0, 96);
        widget.set_value(this._settings.get_int('icon-size'));
        widget.set_increments(1, 2);
        widget.connect('value-changed', w => {
            this._settings.set_int('icon-size', w.get_value_as_int());
        });
        this.icon_size_hbox.pack_start(label, true, true, 0);
        this.icon_size_hbox.pack_start(widget, false, false, 0);

        // Tray position in panel
        this.tray_position_hbox = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 10,
            border_width: 10});
        label = new Gtk.Label({
            label: _('Tray horizontal alignment'),
            hexpand: true,
            halign: Gtk.Align.START,
        });
        widget = new Gtk.ComboBoxText();
        widget.append('center', _('Center'));
        widget.append('left', _('Left'));
        widget.append('right', _('Right'));
        this._settings.bind('tray-pos', widget, 'active-id', Gio.SettingsBindFlags.DEFAULT);
        this.tray_position_hbox.pack_start(label, true, true, 0);
        this.tray_position_hbox.pack_start(widget, false, false, 0);
        
        this.preferences_vbox.pack_start(this.opacity_hbox, true, false, 0)
        this.preferences_vbox.pack_start(this.saturation_hbox, true, false, 0)
        this.preferences_vbox.pack_start(this.brightness_hbox, true, false, 0)
        this.preferences_vbox.pack_start(this.contrast_hbox, true, false, 0)
        this.preferences_vbox.pack_start(this.icon_size_hbox, true, false, 0)
        this.preferences_vbox.pack_start(this.tray_position_hbox, true, false, 0)
        
        
        //Custom icons section
        
        const _custom_list_store = new Gtk.ListStore();
        _custom_list_store.set_column_types ([
            GObject.TYPE_STRING,
            GObject.TYPE_STRING]);
        let custom_init_array = this._settings.get_strv('custom-icons');
        if (custom_init_array.length > 0){
                for (let i=0; i< custom_init_array.length; i=i+2){
                    _custom_list_store.set(_custom_list_store.append(), [0, 1],[custom_init_array[i], custom_init_array[i+1]])
                }
        }
        _custom_list_store.append()

        const _custom_tree_view = new Gtk.TreeView ({
            expand: false,
            model: _custom_list_store });
        const custom_titles = ['Original Icon Name', 'Custom Icon Name'];
        const original_icon_column = new Gtk.TreeViewColumn ({ title: custom_titles[0], sizing: Gtk.TreeViewColumnSizing.AUTOSIZE});
        const custom_icon_column = new Gtk.TreeViewColumn ({ title: custom_titles[1], sizing: Gtk.TreeViewColumnSizing.AUTOSIZE });
        
        const cellrenderer = new Gtk.CellRendererText ({editable: true});

        
        original_icon_column.pack_start (cellrenderer, true);
        custom_icon_column.pack_start (cellrenderer, true);
        original_icon_column.add_attribute (cellrenderer, "text", 0);
        custom_icon_column.add_attribute (cellrenderer, "text", 1);
        _custom_tree_view.insert_column (original_icon_column, 0);
        _custom_tree_view.insert_column (custom_icon_column, 1);
        _custom_tree_view.set_grid_lines(Gtk.TreeViewGridLines.BOTH)
        this.custom_icons_vbox.pack_start(_custom_tree_view, false, false, 0)

        cellrenderer.connect('edited', (w, path, text) => {
            this.selection = _custom_tree_view.get_selection();
            let title = _custom_tree_view.get_cursor()[1].get_title();
            let column_index = custom_titles.indexOf(title);
            let [ isSelected, model, iter ] = this.selection.get_selected();
            let text2 = _custom_list_store.get_value (iter, column_index ? 0 : 1)
            _custom_list_store.set(iter, [column_index],[text])
            let store_length = _custom_list_store.iter_n_children(null);
            let custom_icon_array = []

            let orig_icon = "";
            let cust_icon = "";
            let return_iter = null;
            let success = null;
            let iter_list = null;
            for (let i=0; i < store_length; i++){
                return_iter = _custom_list_store.iter_nth_child(null, i)
                success = return_iter[0];
                iter_list = return_iter[1];
                if (!success){
                        break
                }
                if (iter_list){
                        orig_icon = _custom_list_store.get_value (iter_list, 0);
                        cust_icon = _custom_list_store.get_value (iter_list, 1);
                        if (orig_icon && cust_icon){
                                custom_icon_array.push(orig_icon)
                                custom_icon_array.push(cust_icon)
                        }
                }
                else{
                        break
                }
                
                
            }
            this._settings.set_strv('custom-icons', custom_icon_array);
            
            if (store_length == 1 && (text || text2)){
                _custom_list_store.append()
            }
            if (store_length > 1){
                if ((!text && !text2) && (store_length - 1 > path)){
                    _custom_list_store.remove(iter)
                }
                if ((text || text2) && store_length -1 <= path) {
                    _custom_list_store.append()
                }
               }
            
        });

        
        this.notebook = new Gtk.Notebook()
        this.notebook.append_page(this.preferences_vbox,  new Gtk.Label({label: _('Prefences')}))
        this.notebook.append_page(this.custom_icons_vbox,  new Gtk.Label({label: _('Custom Icons')}))
        this.add(this.notebook)
        
    }
});

function buildPrefsWidget() {
    let widget = new AppIndicatorPreferences();

    if (widget.show_all)
        widget.show_all();

    return widget;
}
