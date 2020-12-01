/**
 * @file MetadataView.ts
 * @fileoverview - Contains a class that defines the Metadata Explorer view
 * container and the contained views such as the system object definitions view.
 */

import { ExtensionContext, EventEmitter, window } from 'vscode';
import { MetadataViewProvider } from './MetadataViewProvider';
import { MetadataNode } from './MetadataNode';

/**
 * @class MetadataView
 * @classdesc - A class with methods and properties for controlling what is
 *    displayed to the user when viewing the metadata explorer's view container.
 */
export class MetadataView {
  private _context: ExtensionContext;
  private _providers: Array<MetadataViewProvider> = [];
  public currentProvider: MetadataViewProvider;
  public _onMetaDataChange: EventEmitter<
    MetadataNode | undefined
  > = new EventEmitter<MetadataNode | undefined>();

  /**
   * @constructor
   * @param {ExtensionContext} context - The extension context instance. This is
   *    used for subscribing to, and triggering VSCode events.
   */
  constructor(context: ExtensionContext) {
    this.currentProvider = new MetadataViewProvider(new EventEmitter());
    this._context = context;
    this._onMetaDataChange = new EventEmitter<MetadataNode | undefined>();
  }

  /* ========================================================================
   * Public Instance Methods
   * ======================================================================== */

  /**
   * Populates the tree view with the specified type of SFCC data. When
   * called, this method will invoke the OCAPIService class to make a call
   * to the configured sandbox, and then render the individual SFCC metadata
   * items.
   *
   * @param {string} [providerType = 'systemObjectDefinitions'] - The type of
   *    data entities that the provider should serve to the tree view for
   *    rendering.
   */
  public getDataFromProvider(providerType: string = 'systemObjectDefinitions') {
    this.currentProvider = this._getDataProvider();

    this._context.subscriptions.push(
      window.registerTreeDataProvider(
        providerType + 'View',
        this.currentProvider
      )
    );
  }

  /* ========================================================================
   * Private Instance Methods
   * ======================================================================== */

  /**
   * Gets an instance of the MetadataViewProvider for populating the
   * Tree View with entities via a call to the OCAPIService class.
   *
   * @param {string} providerType - The name of the type of SFCC object that the
   *    data provider should retrieve via an OCAPI call. The name should be in
   *    cammel case (i.e. System Object Definitions = systemObjectDefinitions).
   */
  private _getDataProvider(): MetadataViewProvider {
    // Check if there is already a MetadataViewProvider for the correct type.
    if (!this._providers.length) {
      // If no existing provider for the specified type, then create it.
      this._providers.push(new MetadataViewProvider(this._onMetaDataChange));
    }

    return this._providers[0];
  }
}
