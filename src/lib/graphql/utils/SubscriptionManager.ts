import { pipe, subscribe } from 'wonka'
import client from '../client'
import { generateSubscriptionOp } from '../build'
import type {
  subscription_rootGenqlSelection,
  SubscriptionResult,
} from '../build'

type CallbackId = string

// Updated SubscriptionCallback type
type SubscriptionCallback<
  T extends subscription_rootGenqlSelection & { __name?: string },
> = (data: SubscriptionResult<T>) => void

/**
 * SubscriptionManager manages GraphQL subscriptions with URQL,
 * allows dynamic addition/removal of callbacks, and auto-handles subscriptions.
 *
 * @template T - The shape of the data returned by the subscription.
 */
class SubscriptionManager<
  T extends subscription_rootGenqlSelection & { __name?: string },
> {
  public callbacks: Map<CallbackId, SubscriptionCallback<T>> = new Map()
  private fields: subscription_rootGenqlSelection & { __name?: string }
  private subscriptionOperation: (() => void) | null = null
  private isSubscribed = false

  constructor(fields: T) {
    this.fields = fields
  }

  /**
   * Add a new callback for the subscription data.
   * Starts the subscription if this is the first callback.
   * @param callback - Function to handle subscription events.
   * @returns CallbackId - A unique ID for the callback.
   */
  public addCallback(callback: SubscriptionCallback<T>): CallbackId {
    const id = this.generateCallbackId()
    this.callbacks.set(id, callback)

    // If no previous subscription, start listening
    if (!this.isSubscribed) {
      this.startSubscription()
    }

    return id
  }

  /**
   * Remove an existing callback using its unique ID.
   * Stops the subscription if no callbacks are left.
   * @param id - Unique callback ID to remove.
   */
  public removeCallback(id: CallbackId) {
    this.callbacks.delete(id)

    // Stop subscription if no callbacks remain
    if (this.callbacks.size === 0) {
      this.stopSubscription()
    }
  }

  /**
   * Start the GraphQL subscription using URQL's client.
   * Triggers registered callbacks when new data is received.
   */
  private startSubscription() {
    console.log('Starting subscription...')
    this.isSubscribed = true

    const { query, variables } = generateSubscriptionOp(this.fields)

    const { unsubscribe } = pipe(
      client.subscription(query, variables),
      subscribe((result) => {
        if (result.data) {
          this.triggerCallbacks(result.data as SubscriptionResult<T>)
        }
      })
    )

    this.subscriptionOperation = unsubscribe
  }

  /**
   * Stop the GraphQL subscription.
   * Unsubscribes from URQL's subscription stream.
   */
  private stopSubscription() {
    console.log('Stopping subscription...')
    if (this.subscriptionOperation) {
      this.subscriptionOperation()
      this.isSubscribed = false
    }
  }

  /**
   * Trigger all registered callbacks with the new subscription data.
   * @param data - The new data received from the subscription.
   */
  private triggerCallbacks(data: SubscriptionResult<T>) {
    this.callbacks.forEach((callback) => callback(data))
  }

  /**
   * Generate a unique ID for the callback using UUID.
   * @returns CallbackId - The generated unique callback ID.
   */
  private generateCallbackId(): CallbackId {
    return crypto?.randomUUID?.() ?? Math.random().toString(36).substring(2)
  }
}

export default SubscriptionManager
