﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Collections.Specialized
{
    public class NotifyCollectionChangedEventArgs<T> : EventArgs
    {
        //
        // Summary:
        //     Initializes a new instance of the System.Collections.Specialized.NotifyCollectionChangedEventArgs
        //     class that describes a System.Collections.Specialized.NotifyCollectionChangedAction.Reset
        //     change.
        //
        // Parameters:
        //   action:
        //     The action that caused the event. This must be set to System.Collections.Specialized.NotifyCollectionChangedAction.Reset.
        public NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction action)
        {

        }
        //
        // Summary:
        //     Initializes a new instance of the System.Collections.Specialized.NotifyCollectionChangedEventArgs
        //     class that describes a one-item change.
        //
        // Parameters:
        //   action:
        //     The action that caused the event. This can be set to System.Collections.Specialized.NotifyCollectionChangedAction.Reset,
        //     System.Collections.Specialized.NotifyCollectionChangedAction.Add, or System.Collections.Specialized.NotifyCollectionChangedAction.Remove.
        //
        //   changedItem:
        //     The item that is affected by the change.
        //
        // Exceptions:
        //   T:System.ArgumentException:
        //     If action is not Reset, Add, or Remove, or if action is Reset and changedItem
        //     is not null.
        public NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction action, object changedItem)
        {

        }
        //
        // Summary:
        //     Initializes a new instance of the System.Collections.Specialized.NotifyCollectionChangedEventArgs
        //     class that describes a multi-item change.
        //
        // Parameters:
        //   action:
        //     The action that caused the event. This can be set to System.Collections.Specialized.NotifyCollectionChangedAction.Reset,
        //     System.Collections.Specialized.NotifyCollectionChangedAction.Add, or System.Collections.Specialized.NotifyCollectionChangedAction.Remove.
        //
        //   changedItems:
        //     The items that are affected by the change.
        public NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction action, IList<T> changedItems)
        {

        }
        //
        // Summary:
        //     Initializes a new instance of the System.Collections.Specialized.NotifyCollectionChangedEventArgs
        //     class that describes a one-item change.
        //
        // Parameters:
        //   action:
        //     The action that caused the event. This can be set to System.Collections.Specialized.NotifyCollectionChangedAction.Reset,
        //     System.Collections.Specialized.NotifyCollectionChangedAction.Add, or System.Collections.Specialized.NotifyCollectionChangedAction.Remove.
        //
        //   changedItem:
        //     The item that is affected by the change.
        //
        //   index:
        //     The index where the change occurred.
        //
        // Exceptions:
        //   T:System.ArgumentException:
        //     If action is not Reset, Add, or Remove, or if action is Reset and either changedItems
        //     is not null or index is not -1.
        public NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction action, object changedItem, int index)
        {

        }
        //
        // Summary:
        //     Initializes a new instance of the System.Collections.Specialized.NotifyCollectionChangedEventArgs
        //     class that describes a multi-item change or a System.Collections.Specialized.NotifyCollectionChangedAction.Reset
        //     change.
        //
        // Parameters:
        //   action:
        //     The action that caused the event. This can be set to System.Collections.Specialized.NotifyCollectionChangedAction.Reset,
        //     System.Collections.Specialized.NotifyCollectionChangedAction.Add, or System.Collections.Specialized.NotifyCollectionChangedAction.Remove.
        //
        //   changedItems:
        //     The items affected by the change.
        //
        //   startingIndex:
        //     The index where the change occurred.
        //
        // Exceptions:
        //   T:System.ArgumentException:
        //     If action is not Reset, Add, or Remove, if action is Reset and either changedItems
        //     is not null or startingIndex is not -1, or if action is Add or Remove and startingIndex
        //     is less than -1.
        //
        //   T:System.ArgumentNullException:
        //     If action is Add or Remove and changedItems is null.
        public NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction action, IList<T> changedItems, int startingIndex)
        {

        }
        //
        // Summary:
        //     Initializes a new instance of the System.Collections.Specialized.NotifyCollectionChangedEventArgs
        //     class that describes a one-item System.Collections.Specialized.NotifyCollectionChangedAction.Replace
        //     change.
        //
        // Parameters:
        //   action:
        //     The action that caused the event. This can only be set to System.Collections.Specialized.NotifyCollectionChangedAction.Replace.
        //
        //   newItem:
        //     The new item that is replacing the original item.
        //
        //   oldItem:
        //     The original item that is replaced.
        //
        // Exceptions:
        //   T:System.ArgumentException:
        //     If action is not Replace.
        public NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction action, object newItem, object oldItem)
        {

        }
        //
        // Summary:
        //     Initializes a new instance of the System.Collections.Specialized.NotifyCollectionChangedEventArgs
        //     class that describes a multi-item System.Collections.Specialized.NotifyCollectionChangedAction.Replace
        //     change.
        //
        // Parameters:
        //   action:
        //     The action that caused the event. This can only be set to System.Collections.Specialized.NotifyCollectionChangedAction.Replace.
        //
        //   newItems:
        //     The new items that are replacing the original items.
        //
        //   oldItems:
        //     The original items that are replaced.
        //
        // Exceptions:
        //   T:System.ArgumentException:
        //     If action is not Replace.
        //
        //   T:System.ArgumentNullException:
        //     If oldItems or newItems is null.
        public NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction action, IList<T> newItems, IList<T> oldItems)
        {

        }
        //
        // Summary:
        //     Initializes a new instance of the System.Collections.Specialized.NotifyCollectionChangedEventArgs
        //     class that describes a one-item System.Collections.Specialized.NotifyCollectionChangedAction.Replace
        //     change.
        //
        // Parameters:
        //   action:
        //     The action that caused the event. This can be set to System.Collections.Specialized.NotifyCollectionChangedAction.Replace.
        //
        //   newItem:
        //     The new item that is replacing the original item.
        //
        //   oldItem:
        //     The original item that is replaced.
        //
        //   index:
        //     The index of the item being replaced.
        //
        // Exceptions:
        //   T:System.ArgumentException:
        //     If action is not Replace.
        public NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction action, object newItem, object oldItem, int index)
        {

        }
        //
        // Summary:
        //     Initializes a new instance of the System.Collections.Specialized.NotifyCollectionChangedEventArgs
        //     class that describes a multi-item System.Collections.Specialized.NotifyCollectionChangedAction.Replace
        //     change.
        //
        // Parameters:
        //   action:
        //     The action that caused the event. This can only be set to System.Collections.Specialized.NotifyCollectionChangedAction.Replace.
        //
        //   newItems:
        //     The new items that are replacing the original items.
        //
        //   oldItems:
        //     The original items that are replaced.
        //
        //   startingIndex:
        //     The index of the first item of the items that are being replaced.
        //
        // Exceptions:
        //   T:System.ArgumentException:
        //     If action is not Replace.
        //
        //   T:System.ArgumentNullException:
        //     If oldItems or newItems is null.
        public NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction action, IList<T> newItems, IList<T> oldItems, int startingIndex)
        {

        }
        //
        // Summary:
        //     Initializes a new instance of the System.Collections.Specialized.NotifyCollectionChangedEventArgs
        //     class that describes a one-item System.Collections.Specialized.NotifyCollectionChangedAction.Move
        //     change.
        //
        // Parameters:
        //   action:
        //     The action that caused the event. This can only be set to System.Collections.Specialized.NotifyCollectionChangedAction.Move.
        //
        //   changedItem:
        //     The item affected by the change.
        //
        //   index:
        //     The new index for the changed item.
        //
        //   oldIndex:
        //     The old index for the changed item.
        //
        // Exceptions:
        //   T:System.ArgumentException:
        //     If action is not Move or index is less than 0.
        public NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction action, object changedItem, int index, int oldIndex)
        {

        }
        //
        // Summary:
        //     Initializes a new instance of the System.Collections.Specialized.NotifyCollectionChangedEventArgs
        //     class that describes a multi-item System.Collections.Specialized.NotifyCollectionChangedAction.Move
        //     change.
        //
        // Parameters:
        //   action:
        //     The action that caused the event. This can only be set to System.Collections.Specialized.NotifyCollectionChangedAction.Move.
        //
        //   changedItems:
        //     The items affected by the change.
        //
        //   index:
        //     The new index for the changed items.
        //
        //   oldIndex:
        //     The old index for the changed items.
        //
        // Exceptions:
        //   T:System.ArgumentException:
        //     If action is not Move or index is less than 0.
        public NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction action, IList<T> changedItems, int index, int oldIndex)
        {

        }

        //
        // Summary:
        //     Gets the action that caused the event.
        //
        // Returns:
        //     A System.Collections.Specialized.NotifyCollectionChangedAction value that describes
        //     the action that caused the event.
        public NotifyCollectionChangedAction Action { get; }
        //
        // Summary:
        //     Gets the list of new items involved in the change.
        //
        // Returns:
        //     The list of new items involved in the change.
        public IList<T> NewItems { get; }
        //
        // Summary:
        //     Gets the index at which the change occurred.
        //
        // Returns:
        //     The zero-based index at which the change occurred.
        public int NewStartingIndex { get; }
        //
        // Summary:
        //     Gets the list of items affected by a System.Collections.Specialized.NotifyCollectionChangedAction.Replace,
        //     Remove, or Move action.
        //
        // Returns:
        //     The list of items affected by a System.Collections.Specialized.NotifyCollectionChangedAction.Replace,
        //     Remove, or Move action.
        public IList<T> OldItems { get; }
        //
        // Summary:
        //     Gets the index at which a System.Collections.Specialized.NotifyCollectionChangedAction.Move,
        //     Remove, or Replace action occurred.
        //
        // Returns:
        //     The zero-based index at which a System.Collections.Specialized.NotifyCollectionChangedAction.Move,
        //     Remove, or Replace action occurred.
        public int OldStartingIndex { get; }
    }

    public enum NotifyCollectionChangedAction
    {
        //
        // Summary:
        //     An item was added to the collection.
        Add = 0,
        //
        // Summary:
        //     An item was removed from the collection.
        Remove = 1,
        //
        // Summary:
        //     An item was replaced in the collection.
        Replace = 2,
        //
        // Summary:
        //     An item was moved within the collection.
        Move = 3,
        //
        // Summary:
        //     The content of the collection was cleared.
        Reset = 4
    }
}
