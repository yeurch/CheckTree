## Overview

CheckTree is a jQuery plugin, written for jQuery 1.7.0 and later, that allows you to
easily turn a standard ordered list into a hierarchical tree that is both check-able
and collapsible.

It, like jQuery, is licensed under either the GPL or MIT license.

Original project Copyright (C) 2012 JJ Geewax  
This fork Copyright (C) 2013-2022 Richard Fawcett

## Getting Started

In your HTML markup, define an unordered list using the following layout:

    <ul class="tree">
      <li>
        <input type="checkbox">
        <label>Option 1</label>
        <ul>
          <li>
            <input type="checkbox" name="ourvar" value="1a">
            <label>Option 1A</label>
          </li>
          <li>
            <input type="checkbox" name="ourvar" value="1b">
            <label>Option 1B</label>
          </li>
        </ul>
      </li>
      <li>
        <input type="checkbox" name="ourvar" value="2">
        <label>Option 2</label>
      </li>
    </ul>

After ensuring you've included a reference to the jQuery script, add the following script
to your page.

    $(function(){
      $("ul.tree").checkTree();
    });

The script will replace the HTML checkbox controls with a `div` with class `checkbox`. It will
also add the classes `checked` or `half_checked` to this div, depending on whether all children,
or some children, are checked.

A `div` with class `arrow` is prepended to each non-leaf-node checkbox. Such `div` elements are
also adorned with either a `collapsed` or `expanded` class to indicate whether the node is
collapsed or expanded.  These can be used to assign different background images in CSS.

## Options

The `checkTree()` function optionally accepts an object variable containing options. The
following keys are supported:

* __onExpand__ - a function which is called when a node in the tree is expanded.
* __onCollapse__ - a function which is called when a node in the tree is collapsed.
* __onCheck__ - a function which is called when a checkbox is ticked.
* __onUnCheck__ - a function which is called when a checkbox is unticked.
* __onHalfCheck__ - a function which is called when a checkbox becomes half-checked.
* __onLabelHoverOver__ - a function which is called when a label is hovered over.
* __onLabelHoverOut__ - a function which is called when a label is no longer being hovered over.
* __labelAction__ - either 'expand' or 'check' - determines what happens when a label is clicked.

