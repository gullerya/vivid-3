import { DataGrid, DataGridRow as FoundationElement } from '@microsoft/fast-foundation';
import {attr, observable} from '@microsoft/fast-element';

/**
 * Base class for data-grid
 *
 * @public
 */
export class DataGridRow extends FoundationElement {
	@attr({mode: 'fromView'}) selectable: boolean = false;
	@attr({mode: 'boolean'}) selected = false;
	@attr({mode: 'boolean'}) expanded = false;
	@attr() expandedRowTemplate: any;
	@attr() treeViewProperty?:string;
	@attr({mode: 'boolean'}) treeViewOpen = false;
	@observable subGrid?: DataGrid;

	toggleTreeView(): any {
		this.treeViewOpen = !this.treeViewOpen;
	}

	subGridChanged() {
		if (this.subGrid?.rowsData) {
			this.subGrid.rowsData = (this.rowData && this.treeViewProperty) ? (this.rowData as any)[this.treeViewProperty] as any : null;
		} 
		console.log(this.subGrid);
	}
}
