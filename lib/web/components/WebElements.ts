export module WebElements{

    export interface WebElement {
        selector: string;
        checkVisibility(): WebElement;
        forceClick(): WebElement;
    }

    export class Toggl implements WebElement{
        selector;

        checkVisibility(): Toggl {
            cy.get(this.selector).should('be.visible');
            return this;
        }

        forceClick(): Toggl {
            cy.get(this.selector).click({ force: true });
            return this;
        }
    }

    export class Select implements WebElement{
        selector;
        options;//List<Option>

        constructor(selector) {
        }
        checkVisibility(): WebElements.WebElement {
            cy.get(this.selector).should('be.visible');
            return this;
        }

        forceClick(): Select {
            cy.get(this.selector).click({ force: true });
            return this;
        }
    }

    export class Option {

    }

    export class WebTable implements WebElement {
        selector;
        innerTableSelector: string;
        protected _rows: Array<TableDataRow>;

        get rows(): Array<WebElements.TableDataRow> {
            return this._rows;
        }

        private set rows(value: Array<WebElements.TableDataRow>) {
            this._rows = value;
        }

        protected constructor(selector: string, tableSelector: string) {
            this._rows = new Array<TableDataRow>();
            this.selector = selector;
            this.innerTableSelector = tableSelector;
        }


        checkVisibility(): WebElements.WebElement {
            cy.get(this.selector).should('be.visible');
            return this;
        }

        forceClick(): WebTable {
            cy.get(this.selector).click({force: true});
            return this;
        }

        //possible eager or lazy mode
        //on eager calls init right now, on lazy - when we need to get row
        async initData(eager: boolean, rowSelector:string = 'tr'): Promise<WebTable> {
            //Selecting all rows on the presenting table and creating a new row object for each one
            cy.get(this.innerTableSelector).find(`${rowSelector}`).each((instance, index) => {
                let row = new SimpleDataRow(`${rowSelector}:nth-child(${index + 1})`);
                eager? row.initData():'';
                this._rows.push(row);
            });
            return this;
        };

        row(index: number): TableDataRow {
            this._rows[index].initData();
            return this._rows[index];
        }

        //returns all rows for the table
        async currentRows(): Promise<TableDataRow[]> {
            return this._rows;
        }

    }
    export class PaginatedTable extends WebTable {
        protected readonly nextPage: Button;
        protected readonly prevPage: Button;
        protected _rowSelector: string;
        protected readonly entriesAmountMode: Select;

        protected entriesAmount: Label;
        protected pageNumber: number;

        constructor(selector: string, tableSelector: string, prevButtonSelector?: string,
                    nextButtonSelector?: string,
                    entriesAmountSelector?: string,
                    rowSelector?: string) {
            super(selector, tableSelector);
            this.nextPage = new Button(nextButtonSelector? nextButtonSelector : `${this.selector} a[id*='next']`);
            this.prevPage = new Button(prevButtonSelector? prevButtonSelector: `${this.selector} a[id*='prev']`);
            this.entriesAmountMode = new Select(entriesAmountSelector? entriesAmountSelector: `${this.selector} > select`);
            this._rowSelector = rowSelector? rowSelector: 'tr';
            this.pageNumber = 1;
        }
        async goPrevPage(): Promise<PaginatedTable> {
            this.prevPage.click();
            this.pageNumber--;
            this._rows = await this.currentRows();
            return this;
        }
        async goNextPage(): Promise<PaginatedTable> {
            this.nextPage.click();
            this.pageNumber++;
            this._rows = await this.currentRows();
            return this;
        };

        //returns rows on the current page (always eager)
        override async currentRows(): Promise<WebElements.TableDataRow[]> {

            let currentRows = new Array<WebElements.TableDataRow>();
            cy.get(this.innerTableSelector).find('tbody').find(this._rowSelector).each(($el, index, $list) => {
                let row = new SimpleDataRow(`${this._rowSelector}:nth-child(${index + 1})`);
                row.initData();
                this._rows.push(row);
            });

            return currentRows;
        }
        rowCount(): number {
            return this._rows.length;
        }

        async initData(eager: boolean, rowSelector: string): Promise<WebTable> {
            await super.initData(eager,rowSelector);
            return this;
        }

    }

    export abstract class TableDataRow implements WebElement{
        selector: string;
        protected _entity : object;
        protected constructor(selector: string) {
            this.selector = selector;
        }


        get entity(): object {
            return this._entity;
        }

        set entity(value: object) {
            this._entity = value;
        }

        checkVisibility(): TableDataRow {
            cy.get(this.selector).should('be.visible');
            return this;
        }

        forceClick(): TableDataRow {
            cy.get(this.selector).click({ force: true });
            return this;
        }

        //possible eager or lazy mode
        //on eager calls init right now, on lazy - when we need to get row

        abstract initData(): TableDataRow;

    }

    export class SimpleDataRow extends TableDataRow {
        private readonly _cells: Array<WebElement>;
        constructor(selector: string) {
            super(selector);
            this._cells = new Array<WebElement>();
        }

        cell(index: number): WebElement {
            return this._cells[index];
        }

        initData(): SimpleDataRow {
            //cy get for each cell initialize label with text data and selector
            //then push to array
            return this;
        }

    }

    export class Input<T> implements WebElement {

        private readonly _selector;
        private _value: T;

        constructor(selector: string) {
            this._selector = selector;
        }

        checkValue(expectedValue: T): Input<T> {
            cy.get(this.selector).should('have.value', expectedValue.toString());
            return this;
        }

        checkVisibility(): WebElements.WebElement {
            cy.get(this.selector).should('be.visible');
            return this;
        }

        get selector() {
            return this._selector;
        }

        click(): Input<T> {
            cy.get(this.selector).click();
            return this;
        }

        forceClick(): Input<T> {
            cy.get(this.selector).click({ force: true });
            return this;
        }

        type(value: T, option?: Object): Input<T> {
            this._value = value;
            cy.get(this.selector).type(value.toString(), option);
            return this;
        }

        blur(): Input<T> {
            cy.get(this.selector).blur();
            return this;
        }

        clear(option?: Object): Input<T> {
            cy.get(this.selector).clear(option);
            return this;
        }

    }

    export class Button implements WebElement {

        private readonly _selector;

        constructor(selector: string) {
            this._selector = selector;
        }

        get selector() {
            return this._selector;
        }

        checkVisibility(): WebElements.WebElement {
            cy.get(this.selector).should('be.visible');
            return this;
        }

        click(option?: Object): Button {
            cy.get(this.selector).click(option);
            return this;
        }

        forceClick(): Button {
            cy.get(this.selector).click({ force: true});
            return this;
        }

        should(option1: string, option2?: string, option3?: string): Button {
            cy.get(this.selector).should(option1, option2, option3);
            return this;
        }

        checkExisting(): WebElements.WebElement {
            cy.get(this.selector).should('exist');
            return this;
        }
    }

    export class Label implements WebElement{

        private readonly _selector;
        private _text: string;
        private readonly retrieveTextFromCyElement = (text: string) => {this._text = text};

        constructor(selector: string) {
            this._selector = selector;
        }

        get selector() {
            return this._selector;
        }

        checkVisibility(): Label {
            cy.get(this.selector).should('be.visible');
            return this;
        }
        checkText(text: string): Label {
            cy.get(this.selector).should('include.text', text);
            return this;
        }
        getText(): string {
            cy.get(this.selector).invoke('text').then((text) => this.retrieveTextFromCyElement(text));
            return this._text;
        }
        click(): Label {
            cy.get(this.selector).click();
            return this;
        }
        forceClick(): Label {
            cy.get(this.selector).click({ force: true });
            return this;
        }

    }

    export class Modal implements WebElement{

        private readonly _selector;


        constructor(selector: string) {
            this._selector = selector;
        }

        get selector() {
            return this._selector;
        }

        checkVisibility(): Modal {
            cy.get(this.selector).should('be.visible');
            return this;
        }

        click(): Modal {
            cy.get(this.selector).click();
            return this;
        }

        forceClick(): Modal {
            cy.get(this.selector).click({ force: true });
            return this;
        }

    }

    export class Link implements WebElement{

        private readonly _selector;

        constructor(selector: string) {
            this._selector = selector;
        }

        get selector() {
            return this._selector;
        }

        checkVisibility(): WebElements.WebElement {
            cy.get(this.selector).should('be.visible');
            return this;
        }

        goto(): Link {

            cy.get(this.selector).click();
            return this;
        }

        forceClick(): Link {
            cy.get(this.selector).click({ force: true });
            return this;
        }
    }

    export class Icon implements WebElement{

        private readonly _selector;

        constructor(selector: string) {
            this._selector = selector;
        }

        get selector() {
            return this._selector;
        }

        checkVisibility(): WebElements.WebElement {
            cy.get(this.selector).should('be.visible');
            return this;
        }

        click(): Icon {
            cy.get(this.selector).click();
            return this;
        }

        forceClick(): Icon {
            cy.get(this.selector).click({ force: true });
            return this;
        }
    }

    export class Checkbox implements WebElement{
        private readonly _selector;

        constructor(selector: string){
            this._selector = selector;
        }

        get selector() {
            return this._selector;
        }

        checkVisibility(): WebElements.WebElement {
            cy.get(this.selector).should('be.visible');
            return this;
        }

        forceClick(): Checkbox {
            cy.get(this.selector).click({ force: true });
            return this;
        }

        check(): Checkbox {
            cy.get(this.selector).then(($ele) => {
                if (!$ele.is(':checked')) {
                    cy.wrap($ele).check()
                } else {
                    cy.get(this.selector).should('be.checked')
                }
            })
            return this;
        }

        uncheck(): Checkbox {
            cy.get(this.selector).then(($ele) => {
                if ($ele.is(':checked')) {
                    cy.wrap($ele).uncheck()
                } else {
                    cy.get(this.selector).should('not.be.checked')
                }
            })
            return this;
        }

        isChecked(): Checkbox {
            cy.get(this.selector).get('be.checked')
            return this;
        }
    }

}
