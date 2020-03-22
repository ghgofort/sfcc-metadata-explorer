import { OCAPIService } from '../services/OCAPIService';
import SitePreferencesHelper from './SitePreferencesHelper';
import { MetadataNode } from '../components/MetadataNode';
import { CancellationTokenSource, CancellationToken } from 'vscode';

/**
 * @class
 * @classdesc - A helper class for handling command actions that are separate
 *    from the view provider functionality.
 */
export default class CommandHelper {
  private service: OCAPIService;
  private prefsHelper: SitePreferencesHelper;

  constructor() {
    this.service = new OCAPIService();
    this.prefsHelper = new SitePreferencesHelper(this.service);
  }

  /**
   * Handles the command action to set the value of a SitePreferences custom
   * attribute to the value specified by the user.
   * @param {MetadataNode} element - The selected element when the command was
   *    invoked to set the pref value.
   */
  public async setPref(element: MetadataNode) {
    // Create a cancelation token instance to cancel the request when needed.
    const tokenSource: CancellationTokenSource = new CancellationTokenSource();
    const cancelAddAttributeToken: CancellationToken = tokenSource.token;

    // Get attribute data type from the element.
    var elementDataType = '';
  }
}
