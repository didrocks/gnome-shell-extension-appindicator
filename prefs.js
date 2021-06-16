// -*- mode: js2; indent-tabs-mode: nil; js2-basic-offset: 4 -*-

/* exported init, buildPrefsWidget */

const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Gettext = imports.gettext.domain(Me.metadata['gettext-domain']);
const _ = Gettext.gettext;

function init() {
    ExtensionUtils.initTranslations();
}

const AppIndicatorPreferences = GObject.registerClass(
class AppIndicatorPreferences extends Gtk.Box {
    _init() {
        super._init({ orientation: Gtk.Orientation.VERTICAL, spacing: 30 });
        this._settings = ExtensionUtils.getSettings();

        let label = null;
        let widget = null;


        this.preferences_vbox = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL,
            spacing: 8,
            border_width: 30 });
        this.custom_icons_vbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 10,
            border_width: 10 });


        // Icon opacity
        this.opacity_hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 10,
            border_width: 10 });
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
        this.saturation_hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 10,
            border_width: 10 });
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
        this.brightness_hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 10,
            border_width: 10 });
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
        this.contrast_hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 10,
            border_width: 10 });
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
        this.icon_size_hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 10,
            border_width: 10 });
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
        this.tray_position_hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 10,
            border_width: 10 });
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

        this.preferences_vbox.pack_start(this.opacity_hbox, true, false, 0);
        this.preferences_vbox.pack_start(this.saturation_hbox, true, false, 0);
        this.preferences_vbox.pack_start(this.brightness_hbox, true, false, 0);
        this.preferences_vbox.pack_start(this.contrast_hbox, true, false, 0);
        this.preferences_vbox.pack_start(this.icon_size_hbox, true, false, 0);
        this.preferences_vbox.pack_start(this.tray_position_hbox, true, false, 0);


        // Custom icons section

        const customListStore = new Gtk.ListStore();
        customListStore.set_column_types([
            GObject.TYPE_STRING,
            GObject.TYPE_STRING,
        ]);
        let customInitArray = this._settings.get_strv('custom-icons');
        if (customInitArray.length > 0) {
            for (let i = 0; i < customInitArray.length; i += 2)
                customListStore.set(customListStore.append(), [0, 1], [customInitArray[i], customInitArray[i + 1]]);

        }
        customListStore.append();

        const customTreeView = new Gtk.TreeView({ expand: false,
            model: customListStore });
        const customTitles = ['Indicator ID', 'Custom Icon Name'];
        const originalIconColumn = new Gtk.TreeViewColumn({ title: customTitles[0], sizing: Gtk.TreeViewColumnSizing.AUTOSIZE });
        const customIconColumn = new Gtk.TreeViewColumn({ title: customTitles[1], sizing: Gtk.TreeViewColumnSizing.AUTOSIZE });

        const cellrenderer = new Gtk.CellRendererText({ editable: true });


        originalIconColumn.pack_start(cellrenderer, true);
        customIconColumn.pack_start(cellrenderer, true);
        originalIconColumn.add_attribute(cellrenderer, 'text', 0);
        customIconColumn.add_attribute(cellrenderer, 'text', 1);
        customTreeView.insert_column(originalIconColumn, 0);
        customTreeView.insert_column(customIconColumn, 1);
        customTreeView.set_grid_lines(Gtk.TreeViewGridLines.BOTH);
        this.custom_icons_vbox.pack_start(customTreeView, false, false, 0);

        cellrenderer.connect('edited', (w, path, text) => {
            this.selection = customTreeView.get_selection();
            let title = customTreeView.get_cursor()[1].get_title();
            let columnIndex = customTitles.indexOf(title);
            let selection = this.selection.get_selected();
            let iter = selection[2];
            let text2 = customListStore.get_value(iter, columnIndex ? 0 : 1);
            customListStore.set(iter, [columnIndex], [text]);
            let storeLength = customListStore.iter_n_children(null);
            let customIconArray = [];

            let origIcon = '';
            let customIcon = '';
            let returnIter = null;
            let success = null;
            let iterList = null;
            for (let i = 0; i < storeLength; i++) {
                returnIter = customListStore.iter_nth_child(null, i);
                success = returnIter[0];
                iterList = returnIter[1];
                if (!success)
                    break;

                if (iterList) {
                    origIcon = customListStore.get_value(iterList, 0);
                    customIcon = customListStore.get_value(iterList, 1);
                    if (origIcon && customIcon) {
                        customIconArray.push(origIcon);
                        customIconArray.push(customIcon);
                    }
                } else {
                    break;
                }


            }
            this._settings.set_strv('custom-icons', customIconArray);
            if (storeLength === 1 && (text || text2))
                customListStore.append();

            if (storeLength > 1) {
                if ((!text && !text2) && (storeLength - 1 > path))
                    customListStore.remove(iter);
                if ((text || text2) && storeLength - 1 <= path)
                    customListStore.append();
            }
        });

        this.notebook = new Gtk.Notebook();
        this.notebook.append_page(this.preferences_vbox,  new Gtk.Label({ label: _('Preferences') }));
        this.notebook.append_page(this.custom_icons_vbox,  new Gtk.Label({ label: _('Custom Icons') }));
        this.add(this.notebook);

    }
});

function buildPrefsWidget() {
    let widget = new AppIndicatorPreferences();

    if (widget.show_all)
        widget.show_all();

    return widget;
}
